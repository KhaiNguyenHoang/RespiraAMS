namespace RespiraAMS_Platform.Shared.Exceptions;

/// <summary>
/// Exception when something unexpectedly happen. The source of the exception can either be client
/// or server
/// </summary>
/// <param name="message">Exception message</param>
public class UnexpectedException(string message) : Exception(message)
{
    
}