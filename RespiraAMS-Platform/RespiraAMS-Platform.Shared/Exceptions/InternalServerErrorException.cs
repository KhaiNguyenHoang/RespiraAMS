namespace RespiraAMS_Platform.Shared.Exceptions;

/// <summary>
/// Internal server error exception. Use for when the error is from the server side
/// </summary>
public class InternalServerErrorException() : Exception("Internal server error")
{
    
}