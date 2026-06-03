namespace Application.Abstracts.Storage
{
    public interface IStorageService
    {
        Task<string> UploadAsync(
            byte[] content,
            string fileName,
            string contentType,
            string bucketName,
            CancellationToken cancellationToken = default
        );

        Task DeleteAsync(
            string objectKey,
            string bucketName,
            CancellationToken cancellationToken = default
        );
    }
}
