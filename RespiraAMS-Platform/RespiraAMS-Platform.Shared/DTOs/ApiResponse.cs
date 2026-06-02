namespace RespiraAMS_Platform.Shared.DTOs
{
    public class ApiResponse<T>
    {
        public int? StatusCode { get; set; }
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }

        public static ApiResponse<T> Ok(T data, string? message = null, int? statusCode = 200)
        {
            return new()
            {
                Success = true,
                Message = message,
                Data = data,
                StatusCode = statusCode,
            };
        }

        public static ApiResponse<T> Fail(string? message = null, int? statusCode = 400)
        {
            return new()
            {
                StatusCode = statusCode,
                Success = false,
                Message = message,
            };
        }
    }
}
