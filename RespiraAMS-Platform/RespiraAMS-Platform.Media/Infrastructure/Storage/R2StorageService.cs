using Amazon.S3;
using Amazon.S3.Model;
using Application.Abstracts.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Storage
{
    public class R2StorageService(
        IAmazonS3 s3Client,
        IConfiguration configuration,
        ILogger<R2StorageService> logger
    ) : IStorageService
    {
        private readonly string? _publicUrl = configuration["R2:PublicUrl"];

        public async Task<string> UploadAsync(
            byte[] content,
            string fileName,
            string contentType,
            string bucketName,
            CancellationToken cancellationToken = default
        )
        {
            try
            {
                using var stream = new MemoryStream(content);
                var putRequest = new PutObjectRequest
                {
                    BucketName = bucketName,
                    Key = fileName,
                    InputStream = stream,
                    ContentType = contentType,
                    DisablePayloadSigning = true,
                };

                await s3Client.PutObjectAsync(putRequest, cancellationToken);

                if (!string.IsNullOrEmpty(_publicUrl))
                {
                    return $"{_publicUrl.TrimEnd('/')}/{fileName}";
                }

                var serviceUrl = s3Client.Config.ServiceURL;
                if (!string.IsNullOrEmpty(serviceUrl))
                {
                    return $"{serviceUrl.TrimEnd('/')}/{bucketName}/{fileName}";
                }

                return $"https://{bucketName}.r2.cloudflarestorage.com/{fileName}";
            }
            catch (Exception ex)
            {
                logger.LogError(
                    ex,
                    "Failed to upload file {FileName} to Cloudflare R2 bucket {BucketName}",
                    fileName,
                    bucketName
                );
                throw;
            }
        }

        public async Task DeleteAsync(
            string objectKey,
            string bucketName,
            CancellationToken cancellationToken = default
        )
        {
            try
            {
                var deleteRequest = new DeleteObjectRequest
                {
                    BucketName = bucketName,
                    Key = objectKey,
                };

                await s3Client.DeleteObjectAsync(deleteRequest, cancellationToken);
            }
            catch (Exception ex)
            {
                logger.LogError(
                    ex,
                    "Failed to delete file {ObjectKey} from Cloudflare R2 bucket {BucketName}",
                    objectKey,
                    bucketName
                );
            }
        }
    }
}
