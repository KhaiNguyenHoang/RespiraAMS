namespace RespiraAMS_Platform.Shared.DTOs
{
    /// <summary>
    /// API response
    /// </summary>
    /// <typeparam name="T">Response data type</typeparam>
    public class ApiResponse<T>
    {
        /// <summary>
        /// Response status code.
        /// </summary>
        public int? StatusCode { get; set; }
        /// <summary>
        /// True if request success
        /// </summary>
        public bool Success { get; set; }
        /// <summary>
        /// When request fail, message is guaranteed to exist. A success request may or may not have a message
        /// </summary>
        public string? Message { get; set; }
        /// <summary>
        /// Response data type.
        /// </summary>
        public T? Data { get; set; }

        public static ApiResponse<T> Ok(T data, string? message = null, int? statusCode = 200)
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data,
                StatusCode = statusCode,
            };
        }

        public static ApiResponse<T> Fail(string? message = null, int? statusCode = 400)
        {
            return new ApiResponse<T>
            {
                StatusCode = statusCode,
                Success = false,
                Message = message,
            };
        }
    }
    
    /// <summary>
    /// API response
    /// </summary>
    public class ApiResponse
    {
        /// <summary>
        /// Response status code.
        /// </summary>
        public int? StatusCode { get; set; }
        /// <summary>
        /// True if request success
        /// </summary>
        public bool Success { get; set; }
        /// <summary>
        /// When request fail, message is guaranteed to exist. A success request may or may not have a message
        /// </summary>
        public string? Message { get; set; }
    
        public static ApiResponse Ok(string? message = null, int? statusCode = 200)
        {
            return new ApiResponse
            {
                Success = true,
                Message = message,
                StatusCode = statusCode,
            };
        }

        public static ApiResponse Fail(string? message = null, int? statusCode = 500)
        {
            return new ApiResponse
            {
                StatusCode = statusCode,
                Success = false,
                Message = message,
            };
        }
    }
}
