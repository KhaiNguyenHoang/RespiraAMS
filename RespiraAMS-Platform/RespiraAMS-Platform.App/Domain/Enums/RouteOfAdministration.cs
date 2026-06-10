namespace Domain.Enums;

/*
 * Since routes of administration are mostly fixed, enum would be better than an entity model
 */

/// <summary>
/// Antibiotic routes of administration
/// </summary>
public enum RouteOfAdministration
{
    Oral,
    Intravenous,
}