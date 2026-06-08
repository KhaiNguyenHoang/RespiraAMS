using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Abstracts.Data;
using Domain.Entities;
using Wolverine;

namespace Application.Sagas.UpdateDoctorSaga
{
    public class UpdateDoctorSaga : Saga
    {
        // Saga Instance ID (Unique Saga Execution ID)
        public Guid Id { get; set; }

        public Guid DoctorId { get; set; }

        // --- Target/New Values ---
        public string NewFirstName { get; set; } = string.Empty;
        public string NewLastName { get; set; } = string.Empty;
        public string NewEmail { get; set; } = string.Empty;
        public string NewPhoneNumber { get; set; } = string.Empty;
        public string NewAddress { get; set; } = string.Empty;
        public ICollection<string> NewDegrees { get; set; } = [];
        public string NewAcademicTitle { get; set; } = string.Empty;
        public string NewCitizenIdentificationCard { get; set; } = string.Empty;
        public DateTimeOffset? NewDateOfBirth { get; set; }
        public bool NewGender { get; set; }
        public string NewPosition { get; set; } = string.Empty;
        public byte[]? NewAvatar { get; set; }

        // --- Original/Old Values (For Rollback) ---
        public string OldFirstName { get; set; } = string.Empty;
        public string OldLastName { get; set; } = string.Empty;
        public string OldEmail { get; set; } = string.Empty;
        public string OldPhoneNumber { get; set; } = string.Empty;
        public string OldAddress { get; set; } = string.Empty;
        public ICollection<string> OldDegrees { get; set; } = [];
        public string OldAcademicTitle { get; set; } = string.Empty;
        public string OldCitizenIdentificationCard { get; set; } = string.Empty;
        public DateTimeOffset? OldDateOfBirth { get; set; }
        public bool OldGender { get; set; }
        public string OldPosition { get; set; } = string.Empty;
        public Guid? OldMediaId { get; set; }
        public string? OldMediaUrl { get; set; }

        // --- Tracing States ---
        public bool IsAuthUpdated { get; set; }
        public bool IsDoctorUpdated { get; set; }
        public bool IsMediaUpdated { get; set; }
        public bool IsDoctorMediaUpdated { get; set; }

        public Guid? NewMediaId { get; set; }
        public string? NewMediaUrl { get; set; }

        // 1. Start Saga
        public static async Task<(UpdateAuthDoctorCommand, UpdateDoctorSaga)> Start(
            StartUpdateDoctorSaga command,
            IAuthDbContext dbContext
        )
        {
            var currentAuth = await dbContext.AuthDoctors.FindAsync(command.DoctorId);

            var sagaId = Guid.NewGuid();

            var state = new UpdateDoctorSaga
            {
                Id = sagaId,
                DoctorId = command.DoctorId,
                NewFirstName = command.FirstName,
                NewLastName = command.LastName,
                NewEmail = command.Email,
                NewPhoneNumber = command.PhoneNumber,
                NewAddress = command.Address,
                NewDegrees = command.Degrees,
                NewAcademicTitle = command.AcademicTitle,
                NewCitizenIdentificationCard = command.CitizenIdentificationCard,
                NewDateOfBirth = command.DateOfBirth,
                NewGender = command.Gender,
                NewPosition = command.Position,
                NewAvatar = command.Avatar,

                // Backup old Auth values
                OldFirstName = currentAuth?.FirstName ?? string.Empty,
                OldLastName = currentAuth?.LastName ?? string.Empty,
                OldEmail = currentAuth?.Email ?? string.Empty,
                OldPhoneNumber = currentAuth?.PhoneNumber ?? string.Empty,
            };

            var tracker = new ProcessTracker
            {
                Id = sagaId,
                ProcessName = "UpdateDoctor",
                Status = "Pending",
                CreatedAt = DateTimeOffset.UtcNow,
            };
            dbContext.ProcessTrackers.Add(tracker);
            await dbContext.SaveChangesAsync();

            var nextCommand = new UpdateAuthDoctorCommand(
                sagaId,
                command.DoctorId,
                command.FirstName,
                command.LastName,
                command.Email,
                command.PhoneNumber
            );

            return (nextCommand, state);
        }

        // 2. Auth Completed -> Trigger Profile Update
        public UpdateDoctorCommand Handle(UpdateAuthDoctorCompleted @event)
        {
            IsAuthUpdated = true;
            return new UpdateDoctorCommand(
                Id,
                DoctorId,
                NewAddress,
                NewDegrees,
                NewAcademicTitle,
                NewCitizenIdentificationCard,
                NewDateOfBirth,
                NewGender,
                NewPosition
            );
        }

        // 3. Auth Failed -> Fail Tracker & Complete
        public async Task Handle(UpdateAuthDoctorFailed @event, IAuthDbContext dbContext)
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

        // 4. Doctor Profile Completed -> Upload Avatar or Finish
        public async Task Handle(
            UpdateDoctorCompleted @event,
            IAuthDbContext dbContext,
            IMessageBus bus
        )
        {
            IsDoctorUpdated = true;

            // Backup old Profile values
            OldAddress = @event.OldAddress;
            OldDegrees = @event.OldDegrees;
            OldAcademicTitle = @event.OldAcademicTitle;
            OldCitizenIdentificationCard = @event.OldCitizenIdentificationCard;
            OldGender = @event.OldGender;
            OldDateOfBirth = @event.OldDateOfBirth;
            OldPosition = @event.OldPosition;
            OldMediaId = @event.OldMediaId;
            OldMediaUrl = @event.OldMediaUrl;

            if (NewAvatar != null && NewAvatar.Length > 0)
            {
                // Send command to upload new avatar
                await bus.PublishAsync(new UpdateMediaCommand(Id, DoctorId, NewAvatar));
            }
            else
            {
                // No avatar change, finish successfully
                var tracker = await dbContext.ProcessTrackers.FindAsync(Id);
                if (tracker != null)
                {
                    tracker.Status = "Success";
                    await dbContext.SaveChangesAsync();
                }
                MarkCompleted();
            }
        }

        // 5. Doctor Profile Failed -> Rollback Auth Service
        public async Task<RollbackAuthDoctorCommand> Handle(
            UpdateDoctorFailed @event,
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

            return new RollbackAuthDoctorCommand(
                Id,
                DoctorId,
                OldFirstName,
                OldLastName,
                OldEmail,
                OldPhoneNumber
            );
        }

        // 6. Upload Avatar Completed -> Link Media to Doctor Profile
        public UpdateDoctorMediaCommand Handle(MediaUpdated @event)
        {
            IsMediaUpdated = true;
            NewMediaId = @event.MediaId;
            NewMediaUrl = @event.MediaUrl;
            return new UpdateDoctorMediaCommand(Id, DoctorId, @event.MediaId, @event.MediaUrl);
        }

        // 7. Upload Avatar Failed -> Rollback Doctor and Auth Services
        public async Task<(RollbackDoctorCommand, RollbackAuthDoctorCommand)> Handle(
            UpdateMediaFailed @event,
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
                new RollbackDoctorCommand(
                    Id,
                    DoctorId,
                    OldAddress,
                    OldDegrees,
                    OldAcademicTitle,
                    OldCitizenIdentificationCard,
                    OldGender,
                    OldDateOfBirth,
                    OldPosition,
                    OldMediaId,
                    OldMediaUrl
                ),
                new RollbackAuthDoctorCommand(
                    Id,
                    DoctorId,
                    OldFirstName,
                    OldLastName,
                    OldEmail,
                    OldPhoneNumber
                )
            );
        }

        // 8. Update Doctor Media Completed -> SUCCESS (Clean up old avatar if exists)
        public async Task Handle(
            UpdateDoctorMediaCompleted @event,
            IAuthDbContext dbContext,
            IMessageBus bus
        )
        {
            IsDoctorMediaUpdated = true;

            var tracker = await dbContext.ProcessTrackers.FindAsync(Id);
            if (tracker != null)
            {
                tracker.Status = "Success";
                await dbContext.SaveChangesAsync();
            }

            if (OldMediaId.HasValue && OldMediaId != Guid.Empty)
            {
                await bus.PublishAsync(new DeleteMediaCommand(Id, OldMediaId.Value));
            }

            MarkCompleted();
        }

        // 9. Update Doctor Media Failed -> Rollback All
        public async Task<(
            RollbackMediaCommand,
            RollbackDoctorCommand,
            RollbackAuthDoctorCommand
        )> Handle(UpdateDoctorMediaFailed @event, IAuthDbContext dbContext)
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
                new RollbackMediaCommand(Id, NewMediaId ?? Guid.Empty),
                new RollbackDoctorCommand(
                    Id,
                    DoctorId,
                    OldAddress,
                    OldDegrees,
                    OldAcademicTitle,
                    OldCitizenIdentificationCard,
                    OldGender,
                    OldDateOfBirth,
                    OldPosition,
                    OldMediaId,
                    OldMediaUrl
                ),
                new RollbackAuthDoctorCommand(
                    Id,
                    DoctorId,
                    OldFirstName,
                    OldLastName,
                    OldEmail,
                    OldPhoneNumber
                )
            );
        }
    }
}
