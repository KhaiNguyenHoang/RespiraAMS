using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Abstracts.Data;
using Domain.Entities;
using Domain.Enums;
using Wolverine;

namespace Application.Sagas.DeleteDoctorSaga
{
    public class DeleteDoctorSaga : Saga
    {
        // Saga Instance ID (Unique Saga Execution ID)
        public Guid Id { get; set; }

        public Guid DoctorId { get; set; }

        // --- Backed-up AuthDoctor Credentials ---
        public string OldFirstName { get; set; } = string.Empty;
        public string OldLastName { get; set; } = string.Empty;
        public RoleEnum OldRole { get; set; }
        public string OldEmail { get; set; } = string.Empty;
        public string OldPassword { get; set; } = string.Empty;
        public string OldPhoneNumber { get; set; } = string.Empty;

        // --- Backed-up Doctor Profile ---
        public string OldAddress { get; set; } = string.Empty;
        public ICollection<string> OldDegrees { get; set; } = [];
        public string OldAcademicTitle { get; set; } = string.Empty;
        public string OldCitizenIdentificationCard { get; set; } = string.Empty;
        public DateTimeOffset? OldDateOfBirth { get; set; }
        public bool OldGender { get; set; }
        public string OldPosition { get; set; } = string.Empty;
        public Guid? OldMediaId { get; set; }
        public string? OldMediaUrl { get; set; }

        // --- Backed-up Media Asset for Physical Clean Deletion ---
        public string OldMediaFileName { get; set; } = string.Empty;
        public string OldMediaBucketName { get; set; } = string.Empty;

        // --- Tracing States ---
        public bool IsAuthDeleted { get; set; }
        public bool IsDoctorDeleted { get; set; }
        public bool IsMediaDeleted { get; set; }

        // 1. Start Saga
        public static async Task<(object, DeleteDoctorSaga?)> Start(
            StartDeleteDoctorSaga command,
            IAuthDbContext dbContext
        )
        {
            var authDoctor = await dbContext.AuthDoctors.FindAsync(command.DoctorId);
            var sagaId = Guid.NewGuid();

            if (authDoctor == null || authDoctor.IsDeleted)
            {
                var failureTracker = new ProcessTracker
                {
                    Id = sagaId,
                    ProcessName = "DeleteDoctor",
                    Status = "Failed",
                    ErrorMessage = "Doctor not found or already deleted in authentication database.",
                    CreatedAt = DateTimeOffset.UtcNow,
                };
                dbContext.ProcessTrackers.Add(failureTracker);
                await dbContext.SaveChangesAsync();
                return (new DeleteAuthDoctorFailed(sagaId, "Doctor not found or already deleted."), null);
            }

            var state = new DeleteDoctorSaga
            {
                Id = sagaId,
                DoctorId = command.DoctorId,
                OldFirstName = authDoctor.FirstName,
                OldLastName = authDoctor.LastName,
                OldRole = authDoctor.Role,
                OldEmail = authDoctor.Email,
                OldPassword = authDoctor.Password,
                OldPhoneNumber = authDoctor.PhoneNumber
            };

            var tracker = new ProcessTracker
            {
                Id = sagaId,
                ProcessName = "DeleteDoctor",
                Status = "Pending",
                CreatedAt = DateTimeOffset.UtcNow,
            };
            dbContext.ProcessTrackers.Add(tracker);
            await dbContext.SaveChangesAsync();

            var nextCommand = new DeleteAuthDoctorCommand(sagaId, command.DoctorId);
            return (nextCommand, state);
        }

        // 2. Auth Deleted -> Trigger Doctor Profile Delete
        public DeleteDoctorCommand Handle(DeleteAuthDoctorCompleted @event)
        {
            IsAuthDeleted = true;
            return new DeleteDoctorCommand(Id, DoctorId);
        }

        // 3. Auth Delete Failed -> Fail Tracker & Complete
        public async Task Handle(DeleteAuthDoctorFailed @event, IAuthDbContext dbContext)
        {
            var tracker = await dbContext.ProcessTrackers.FindAsync(Id);
            if (tracker != null)
            {
                tracker.Status = "Failed";
                tracker.ErrorMessage = @event.Message;
                await dbContext.SaveChangesAsync();
            }
            MarkCompleted();
        }

        // 4. Doctor Profile Deleted -> Trigger Media Record Delete or Finish
        public async Task Handle(
            DeleteDoctorCompleted @event,
            IAuthDbContext dbContext,
            IMessageBus bus
        )
        {
            IsDoctorDeleted = true;

            // Backup old Profile values
            OldAddress = @event.Address;
            OldDegrees = @event.Degrees;
            OldAcademicTitle = @event.AcademicTitle;
            OldCitizenIdentificationCard = @event.CitizenIdentificationCard;
            OldGender = @event.Gender;
            OldDateOfBirth = @event.DateOfBirth;
            OldPosition = @event.Position;
            OldMediaId = @event.MediaId;
            OldMediaUrl = @event.MediaUrl;

            if (OldMediaId.HasValue && OldMediaId != Guid.Empty)
            {
                // Send command to delete Media record
                await bus.PublishAsync(new DeleteMediaCommand(Id, OldMediaId.Value));
            }
            else
            {
                // No avatar, delete completes successfully
                var tracker = await dbContext.ProcessTrackers.FindAsync(Id);
                if (tracker != null)
                {
                    tracker.Status = "Success";
                    await dbContext.SaveChangesAsync();
                }
                MarkCompleted();
            }
        }

        // 5. Doctor Profile Delete Failed -> Rollback Auth Service
        public async Task<RollbackDeleteAuthDoctorCommand> Handle(
            DeleteDoctorFailed @event,
            IAuthDbContext dbContext
        )
        {
            var tracker = await dbContext.ProcessTrackers.FindAsync(Id);
            if (tracker != null)
            {
                tracker.Status = "Failed";
                tracker.ErrorMessage = @event.Message;
                await dbContext.SaveChangesAsync();
            }
            MarkCompleted();

            return new RollbackDeleteAuthDoctorCommand(
                Id,
                DoctorId,
                OldFirstName,
                OldLastName,
                OldRole.ToString(),
                OldEmail,
                OldPassword,
                OldPhoneNumber
            );
        }

        // 6. Delete Media Record Completed -> Success (Send physical R2 storage deletion and Complete Saga)
        public async Task Handle(
            DeleteMediaCompleted @event,
            IAuthDbContext dbContext,
            IMessageBus bus
        )
        {
            IsMediaDeleted = true;
            OldMediaFileName = @event.FileName;
            OldMediaBucketName = @event.BucketName;

            var tracker = await dbContext.ProcessTrackers.FindAsync(Id);
            if (tracker != null)
            {
                tracker.Status = "Success";
                await dbContext.SaveChangesAsync();
            }

            // Soft delete: keep the physical file in cloud storage so it remains restorable
            /*
            if (!string.IsNullOrEmpty(OldMediaFileName))
            {
                // Non-blocking physical file clean-up in cloud storage
                await bus.PublishAsync(new CleanDeleteMediaCommand(OldMediaFileName, OldMediaBucketName));
            }
            */

            MarkCompleted();
        }

        // 7. Delete Media Record Failed -> Rollback Doctor and Auth Services
        public async Task<(RollbackDeleteDoctorCommand, RollbackDeleteAuthDoctorCommand)> Handle(
            DeleteMediaFailed @event,
            IAuthDbContext dbContext
        )
        {
            var tracker = await dbContext.ProcessTrackers.FindAsync(Id);
            if (tracker != null)
            {
                tracker.Status = "Failed";
                tracker.ErrorMessage = @event.Message;
                await dbContext.SaveChangesAsync();
            }
            MarkCompleted();

            return (
                new RollbackDeleteDoctorCommand(
                    Id,
                    DoctorId,
                    OldAddress,
                    OldDegrees,
                    OldAcademicTitle,
                    OldCitizenIdentificationCard,
                    OldDateOfBirth,
                    OldGender,
                    OldPosition,
                    OldMediaId,
                    OldMediaUrl
                ),
                new RollbackDeleteAuthDoctorCommand(
                    Id,
                    DoctorId,
                    OldFirstName,
                    OldLastName,
                    OldRole.ToString(),
                    OldEmail,
                    OldPassword,
                    OldPhoneNumber
                )
            );
        }
    }
}
