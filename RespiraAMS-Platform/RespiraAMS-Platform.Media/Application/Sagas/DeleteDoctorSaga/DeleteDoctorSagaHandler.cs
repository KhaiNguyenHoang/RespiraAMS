using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Application.Abstracts.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Application.Sagas.DeleteDoctorSaga
{
    public class DeleteDoctorSagaHandler(
        IMediaDbContext dbContext,
        ICacheService cacheService,
        IStorageService storageService,
        IConfiguration configuration,
        ILogger<DeleteDoctorSagaHandler> logger
    )
    {
        private readonly IMediaDbContext _dbContext = dbContext;
        private readonly ICacheService _cacheService = cacheService;
        private readonly IStorageService _storageService = storageService;
        private readonly ILogger<DeleteDoctorSagaHandler> _logger = logger;
        private readonly string _defaultBucketName = configuration["R2:BucketName"] ?? "avatars";

        public async Task<object> Handle(DeleteMediaCommand command)
        {
            try
            {
                var mediaAsset = await _dbContext.MediaAssets.FindAsync(command.MediaId);
                if (mediaAsset?.IsDeleted != false)
                {
                    _logger.LogWarning(
                        "DeleteMediaCommand failed: MediaAsset with ID {MediaId} not found or already deleted.",
                        command.MediaId
                    );
                    return new DeleteMediaFailed(
                        command.Id,
                        "Media asset not found or already deleted."
                    );
                }

                var fileName = mediaAsset.FileName ?? string.Empty;
                var bucketName = mediaAsset.BucketName ?? _defaultBucketName;

                mediaAsset.IsDeleted = true;
                mediaAsset.DeletedAt = DateTimeOffset.UtcNow;
                await _dbContext.SaveChangesAsync();

                // Remove from cache
                await _cacheService.RemoveAsync($"media:id:{command.MediaId}");

                _logger.LogInformation(
                    "Media asset database record soft-deleted successfully for Media ID {MediaId}",
                    command.MediaId
                );

                return new DeleteMediaCompleted(command.Id, fileName, bucketName);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "DeleteMediaCommand failed for Media ID {MediaId}",
                    command.MediaId
                );
                return new DeleteMediaFailed(command.Id, ex.Message);
            }
        }

        public async Task Handle(CleanDeleteMediaCommand command)
        {
            try
            {
                if (!string.IsNullOrEmpty(command.FileName))
                {
                    await _storageService.DeleteAsync(
                        command.FileName,
                        command.BucketName ?? _defaultBucketName
                    );
                    _logger.LogInformation(
                        "Physically deleted media file {FileName} from bucket {BucketName}",
                        command.FileName,
                        command.BucketName
                    );
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to physically delete media file {FileName} from bucket {BucketName}",
                    command.FileName,
                    command.BucketName
                );
            }
        }
    }
}
