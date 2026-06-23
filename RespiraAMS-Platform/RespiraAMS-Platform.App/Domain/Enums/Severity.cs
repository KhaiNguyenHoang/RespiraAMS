using System.Text.Json.Serialization;

namespace Domain.Enums;

/// <summary>
/// Disease severity
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Severity
{
    Mild, 
    Moderate, 
    Severe
}