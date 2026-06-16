using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Application.Abstracts.Storage;
using Domain.Entities;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Application.Sagas.UpdateDoctorSaga
{
    public class UpdateDoctorSagaHandler(
        IMediaDbContext dbContext,
        ICacheService cacheService,
        IStorageService storageService,
        IValidator<UpdateMediaCommand> validator,
        IConfiguration configuration,
        ILogger<UpdateDoctorSagaHandler> logger
    )
    {
        private readonly IMediaDbContext _dbContext = dbContext;
        private readonly ICacheService _cacheService = cacheService;
        private readonly IStorageService _storageService = storageService;
        private readonly IValidator<UpdateMediaCommand> _validator = validator;
        private readonly ILogger<UpdateDoctorSagaHandler> _logger = logger;
        private readonly string _bucketName = configuration["R2:BucketName"] ?? "avatars";

        public async Task<object> Handle(UpdateMediaCommand command)
        {
            try
            {
                var validationResult = await _validator.ValidateAsync(command);
                if (!validationResult.IsValid)
                {
                    var errors = string.Join(
                        "; ",
                        validationResult.Errors.Select(e => e.ErrorMessage)
                    );
                    _logger.LogWarning(
                        "UpdateMediaCommand validation failed for Saga ID {SagaId}: {Errors}",
                        command.Id,
                        errors
                    );
                    return new UpdateMediaFailed(command.Id, errors);
                }

                var mediaId = Guid.NewGuid();
                var fileName = $"avatar_{command.DoctorId}_{mediaId}.png";
                var contentType = "image/png";

                string mediaUrl = string.Empty;
                if (command.Avatar?.Length > 0)
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
                    Id = mediaId,
                    FileName = fileName,
                    Url = mediaUrl,
                    ObjectKey = fileName,
                    BucketName = _bucketName,
                    ContentType = contentType,
                    Size = command.Avatar?.Length ?? 0,
                    CreatedAt = DateTimeOffset.UtcNow,
                };

                _dbContext.MediaAssets.Add(mediaAsset);
                await _dbContext.SaveChangesAsync();

                await _cacheService.SetAsync($"media:id:{mediaAsset.Id}", mediaAsset);
                _logger.LogInformation(
                    "New media asset created successfully for Doctor ID {DoctorId} with Media ID {MediaId}",
                    command.DoctorId,
                    mediaId
                );

                return new MediaUpdated(command.Id, mediaAsset.Id, mediaAsset.Url ?? string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "UpdateMediaCommand failed for Doctor ID {DoctorId}",
                    command.DoctorId
                );
                return new UpdateMediaFailed(command.Id, ex.Message);
            }
        }

        public async Task Handle(RollbackMediaCommand command)
        {
            try
            {
                var mediaAsset = await _dbContext.MediaAssets.FindAsync(command.MediaId);
                if (mediaAsset != null)
                {
                    if (!string.IsNullOrEmpty(mediaAsset.FileName))
                    {
                        await _storageService.DeleteAsync(
                            mediaAsset.FileName,
                            mediaAsset.BucketName ?? _bucketName
                        );
                    }

                    _dbContext.MediaAssets.Remove(mediaAsset);
                    await _dbContext.SaveChangesAsync();

                    await _cacheService.RemoveAsync($"media:id:{command.MediaId}");
                    _logger.LogInformation(
                        "Media asset rolled back successfully for Media ID {MediaId}",
                        command.MediaId
                    );
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "RollbackMediaCommand failed for Media ID {MediaId}",
                    command.MediaId
                );
            }
        }

        public async Task Handle(DeleteMediaCommand command)
        {
            try
            {
                var mediaAsset = await _dbContext.MediaAssets.FindAsync(command.MediaId);
                if (mediaAsset != null)
                {
                    if (!string.IsNullOrEmpty(mediaAsset.FileName))
                    {
                        await _storageService.DeleteAsync(
                            mediaAsset.FileName,
                            mediaAsset.BucketName ?? _bucketName
                        );
                    }

                    _dbContext.MediaAssets.Remove(mediaAsset);
                    await _dbContext.SaveChangesAsync();

                    await _cacheService.RemoveAsync($"media:id:{command.MediaId}");
                    _logger.LogInformation(
                        "Deleted old media asset {MediaId} successfully",
                        command.MediaId
                    );
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "DeleteMediaCommand failed for Media ID {MediaId}",
                    command.MediaId
                );
            }
        }
    }
}
