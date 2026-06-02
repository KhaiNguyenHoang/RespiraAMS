using Application.Abstracts.Data;
using Domain.Entities;
using Wolverine;

namespace Application.Sagas.CreateDoctorSaga
{
    public class CreateDoctorSaga : Saga
    {
        public async Task<(CreateAuthDoctorCommand, CreateDoctorSagaState)> Start(
            StartCreateDoctorSaga command,
            IAuthDbContext dbContext
        )
        {
            var state = new CreateDoctorSagaState
            {
                Id = command.Id,
                FirstName = command.FirstName,
                LastName = command.LastName,
                Email = command.Email,
                PhoneNumber = command.PhoneNumber,
                Password = command.Password,
                Role = command.Role,
                Address = command.Address,
                Degrees = command.Degrees,
                AcademicTitle = command.AcademicTitle,
                CitizenIdentificationCard = command.CitizenIdentificationCard,
                DateOfBirth = command.DateOfBirth,
                Gender = command.Gender,
                Position = command.Position,
                Avatar = command.Avatar,
            };

            var tracker = new ProcessTracker
            {
                Id = command.Id,
                ProcessName = "CreateDoctor",
                Status = "Pending",
                CreatedAt = DateTimeOffset.UtcNow,
            };
            dbContext.ProcessTrackers.Add(tracker);
            await dbContext.SaveChangesAsync();

            var nextCommand = new CreateAuthDoctorCommand(
                command.Id,
                command.FirstName,
                command.LastName,
                command.Role,
                command.Email,
                command.Password,
                command.PhoneNumber
            );

            return (nextCommand, state);
        }

        public CreateDoctorCommand Handle(
            CreateAuthDoctorCompleted @event,
            CreateDoctorSagaState state
        )
        {
            state.IsAuthenticateCompleted = true;
            return new CreateDoctorCommand(
                @event.Id,
                state.Address,
                state.Degrees,
                state.AcademicTitle,
                state.CitizenIdentificationCard,
                state.DateOfBirth,
                state.Gender,
                state.Position
            );
        }

        public async Task<RollbackAuthDoctorCommand> Handle(
            CreateAuthDoctorFailed @event,
            CreateDoctorSagaState state,
            IAuthDbContext dbContext
        )
        {
            state.IsAuthenticateCompleted = false;

            var tracker = await dbContext.ProcessTrackers.FindAsync(state.Id);
            if (tracker != null)
            {
                tracker.Status = "Failed";
                tracker.ErrorMessage = @event.Message;
                await dbContext.SaveChangesAsync();
            }

            MarkCompleted();
            return new RollbackAuthDoctorCommand(@event.Id);
        }

        public CreateMediaCommand Handle(
            CreateDoctorCompleted @event,
            CreateDoctorSagaState state
        )
        {
            state.IsDoctorCompleted = true;
            return new CreateMediaCommand(@event.Id, state.Avatar);
        }

        public async Task<RollbackAuthDoctorCommand> Handle(
            CreateDoctorFailed @event,
            CreateDoctorSagaState state,
            IAuthDbContext dbContext
        )
        {
            state.IsDoctorCompleted = false;

            var tracker = await dbContext.ProcessTrackers.FindAsync(state.Id);
            if (tracker != null)
            {
                tracker.Status = "Failed";
                tracker.ErrorMessage = @event.Message;
                await dbContext.SaveChangesAsync();
            }

            MarkCompleted();
            return new RollbackAuthDoctorCommand(@event.Id);
        }

        public UpdateDoctorMediaCommand Handle(MediaCreated @event, CreateDoctorSagaState state)
        {
            state.IsMediaCompleted = true;
            state.MediaId = @event.MediaId;
            state.MediaUrl = @event.MediaUrl;

            return new UpdateDoctorMediaCommand(state.Id, @event.MediaId, @event.MediaUrl);
        }

        public async Task Handle(
            UpdateDoctorMediaCompleted @event,
            CreateDoctorSagaState state,
            IAuthDbContext dbContext
        )
        {
            state.IsDoctorMediaUpdated = true;

            var tracker = await dbContext.ProcessTrackers.FindAsync(state.Id);
            if (tracker != null)
            {
                tracker.Status = "Success";
                tracker.OutputDataJson = System.Text.Json.JsonSerializer.Serialize(
                    new { state.MediaId, state.MediaUrl }
                );
                await dbContext.SaveChangesAsync();
            }

            MarkCompleted();
        }

        public async Task<(
            RollbackAuthDoctorCommand,
            RollbackDoctorCommand,
            RollbackMediaCommand
        )> Handle(UpdateDoctorMediaFailed @event, CreateDoctorSagaState state, IAuthDbContext dbContext)
        {
            state.IsDoctorMediaUpdated = false;

            var tracker = await dbContext.ProcessTrackers.FindAsync(state.Id);
            if (tracker != null)
            {
                tracker.Status = "Failed";
                tracker.ErrorMessage = @event.Message;
                await dbContext.SaveChangesAsync();
            }

            MarkCompleted();
            return (
                new RollbackAuthDoctorCommand(@event.Id),
                new RollbackDoctorCommand(@event.Id),
                new RollbackMediaCommand(@event.Id)
            );
        }

        public async Task<(RollbackAuthDoctorCommand, RollbackDoctorCommand)> Handle(
            CreateMediaFailed @event,
            CreateDoctorSagaState state,
            IAuthDbContext dbContext
        )
        {
            state.IsMediaCompleted = false;

            var tracker = await dbContext.ProcessTrackers.FindAsync(state.Id);
            if (tracker != null)
            {
                tracker.Status = "Failed";
                tracker.ErrorMessage = @event.Message;
                await dbContext.SaveChangesAsync();
            }

            MarkCompleted();
            return (new RollbackAuthDoctorCommand(@event.Id), new RollbackDoctorCommand(@event.Id));
        }
    }
}
