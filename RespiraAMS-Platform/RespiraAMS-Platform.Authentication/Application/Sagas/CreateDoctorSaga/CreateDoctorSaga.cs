using Application.Abstracts;
using Application.Abstracts.Data;
using Domain.Entities;
using Domain.Enums;
using Wolverine;

namespace Application.Sagas.CreateDoctorSaga
{
    public class CreateDoctorSaga : Saga
    {
        // Saga state properties
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public RoleEnum Role { get; set; } = RoleEnum.Doctor;
        public string Address { get; set; } = string.Empty;
        public ICollection<string> Degrees { get; set; } = [];
        public string AcademicTitle { get; set; } = string.Empty;
        public string CitizenIdentificationCard { get; set; } = string.Empty;
        public DateTimeOffset? DateOfBirth { get; set; }
        public bool Gender { get; set; }
        public string Position { get; set; } = string.Empty;
        public Guid? MediaId { get; set; }
        public string? MediaUrl { get; set; }
        public byte[]? Avatar { get; set; } = [];

        // Tracing states of saga
        public bool IsAuthenticateCompleted { get; set; }
        public bool IsDoctorCompleted { get; set; }
        public bool IsMediaCompleted { get; set; }
        public bool IsDoctorMediaUpdated { get; set; }

        public static async Task<(CreateAuthDoctorCommand, CreateDoctorSaga)> Start(
            StartCreateDoctorSaga command,
            IAuthDbContext dbContext
        )
        {
            var state = new CreateDoctorSaga
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

        public CreateDoctorCommand Handle(CreateAuthDoctorCompleted @event)
        {
            IsAuthenticateCompleted = true;
            return new CreateDoctorCommand(
                @event.Id,
                Address,
                Degrees,
                AcademicTitle,
                CitizenIdentificationCard,
                DateOfBirth,
                Gender,
                Position
            );
        }

        public async Task<RollbackAuthDoctorCommand> Handle(
            CreateAuthDoctorFailed @event,
            IAuthDbContext dbContext
        )
        {
            IsAuthenticateCompleted = false;

            var tracker = await dbContext.ProcessTrackers.FindAsync(Id);
            if (tracker != null)
            {
                tracker.Status = "Failed";
                tracker.ErrorMessage = @event.Message;
                await dbContext.SaveChangesAsync();
            }

            MarkCompleted();
            return new RollbackAuthDoctorCommand(@event.Id);
        }

        public CreateMediaCommand Handle(CreateDoctorCompleted @event)
        {
            IsDoctorCompleted = true;
            return new CreateMediaCommand(@event.Id, Avatar);
        }

        public async Task<RollbackAuthDoctorCommand> Handle(
            CreateDoctorFailed @event,
            IAuthDbContext dbContext
        )
        {
            IsDoctorCompleted = false;

            var tracker = await dbContext.ProcessTrackers.FindAsync(Id);
            if (tracker != null)
            {
                tracker.Status = "Failed";
                tracker.ErrorMessage = @event.Message;
                await dbContext.SaveChangesAsync();
            }

            MarkCompleted();
            return new RollbackAuthDoctorCommand(@event.Id);
        }

        public UpdateDoctorMediaCommand Handle(MediaCreated @event)
        {
            IsMediaCompleted = true;
            MediaId = @event.MediaId;
            MediaUrl = @event.MediaUrl;

            return new UpdateDoctorMediaCommand(Id, @event.MediaId, @event.MediaUrl);
        }

        public async Task Handle(
            UpdateDoctorMediaCompleted @event,
            IAuthDbContext dbContext,
            IEmailService emailService,
            Application.Abstracts.Authentication.IJwtService jwtService
        )
        {
            IsDoctorMediaUpdated = true;

            var tracker = await dbContext.ProcessTrackers.FindAsync(Id);
            if (tracker != null)
            {
                tracker.Status = "Success";
                tracker.OutputDataJson = System.Text.Json.JsonSerializer.Serialize(
                    new { MediaId, MediaUrl }
                );
                await dbContext.SaveChangesAsync();
            }

            var tokenString = new Random().Next(100000, 999999).ToString();
            var hashedToken = jwtService.TokenHash(tokenString);

            var verificationToken = new Token
            {
                HashedToken = hashedToken,
                DoctorId = Id,
                TokenType = TokenType.EmailVerification,
                ExpirationDate = DateTimeOffset.UtcNow.AddMinutes(15).UtcDateTime,
                IsRevoked = false,
                CreatedAt = DateTimeOffset.UtcNow,
            };

            await dbContext.Tokens.AddAsync(verificationToken);
            await dbContext.SaveChangesAsync();

            var subject = "Welcome to RespiraAMS - Verify Your Email";
            var body = $"Welcome to RespiraAMS! Your verification code is: {tokenString}. It will expire in 15 minutes.";
            await emailService.SendEmailAsync(Email, subject, body);

            MarkCompleted();
        }

        public async Task<(
            RollbackAuthDoctorCommand,
            RollbackDoctorCommand,
            RollbackMediaCommand
        )> Handle(UpdateDoctorMediaFailed @event, IAuthDbContext dbContext)
        {
            IsDoctorMediaUpdated = false;

            var tracker = await dbContext.ProcessTrackers.FindAsync(Id);
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
            IAuthDbContext dbContext
        )
        {
            IsMediaCompleted = false;

            var tracker = await dbContext.ProcessTrackers.FindAsync(Id);
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
