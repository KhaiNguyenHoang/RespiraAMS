using System.Text.Json.Serialization;

namespace Domain.Enums;

/*
 * Since routes of administration are mostly fixed, enum would be better than an entity model
 */

/// <summary>
/// Antibiotic routes of administration
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum RouteOfAdministration
{
    Oral,
    Intravenous,
}