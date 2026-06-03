using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Application.Abstracts.Storage;
using Domain.Entities;
using FluentValidation;
using Microsoft.Extensions.Configuration;

namespace Application.Sagas.CreateDoctorSaga
{
    public class CreateDoctorMediaSagaHandler
    {
        private readonly IMediaDbContext _dbContext;
        private readonly ICacheService _cacheService;
        private readonly IStorageService _storageService;
        private readonly IValidator<CreateMediaCommand> _validator;
        private readonly string _bucketName;

        public CreateDoctorMediaSagaHandler(
            IMediaDbContext dbContext,
            ICacheService cacheService,
            IStorageService storageService,
            IValidator<CreateMediaCommand> validator,
            IConfiguration configuration
        )
        {
            _dbContext = dbContext;
            _cacheService = cacheService;
            _storageService = storageService;
            _validator = validator;
            _bucketName = configuration["R2:BucketName"] ?? "avatars";
        }

        public async Task<object> Handle(CreateMediaCommand command)
        {
            try
            {
                var validationResult = await _validator.ValidateAsync(command);
                if (!validationResult.IsValid)
                {
                    var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
                    return new CreateMediaFailed(command.Id, errors);
                }

                var fileName = $"avatar_{command.Id}.png";
                var contentType = "image/png";

                string mediaUrl = string.Empty;
                if (command.Avatar != null && command.Avatar.Length > 0)
                {
                    mediaUrl = await _storageService.UploadAsync(
                        command.Avatar,
                        fileName,
                        contentType,
                        _bucketName
                    );
                }

                var mediaAsset = new MediaAsset
                {
                    Id = command.Id,
                    FileName = fileName,
                    Url = mediaUrl,
                    ObjectKey = fileName,
                    BucketName = _bucketName,
                    ContentType = contentType,
                    Size = command.Avatar?.Length ?? 0,
                    CreatedAt = DateTimeOffset.UtcNow
                };

                _dbContext.MediaAssets.Add(mediaAsset);
                await _dbContext.SaveChangesAsync();

                await _cacheService.SetAsync($"media:id:{mediaAsset.Id}", mediaAsset);

                return new MediaCreated(command.Id, mediaAsset.Id, mediaAsset.Url ?? string.Empty);
            }
            catch (Exception ex)
            {
                return new CreateMediaFailed(command.Id, ex.Message);
            }
        }

        public async Task Handle(RollbackMediaCommand command)
        {
            var mediaAsset = await _dbContext.MediaAssets.FindAsync(command.Id);
            if (mediaAsset != null)
            {
                if (!string.IsNullOrEmpty(mediaAsset.FileName))
                {
                    await _storageService.DeleteAsync(mediaAsset.FileName, mediaAsset.BucketName ?? _bucketName);
                }

                _dbContext.MediaAssets.Remove(mediaAsset);
                await _dbContext.SaveChangesAsync();
            }

            await _cacheService.RemoveAsync($"media:id:{command.Id}");
        }
    }
}
