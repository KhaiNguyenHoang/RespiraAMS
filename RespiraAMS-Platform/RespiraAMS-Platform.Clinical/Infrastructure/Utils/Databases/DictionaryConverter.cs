using System.Text.Json;
using System.Text.Json.Serialization;
using Domain.Enums;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Utils.Databases;

public static class DictionaryConverter
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        Converters =
        {
            new JsonStringEnumConverter()
        }
    };

    public static readonly ValueConverter<Dictionary<RouteOfAdministration, List<string>>, string> Converter = new(
        v => JsonSerializer.Serialize(v, JsonOptions),
        v => JsonSerializer.Deserialize<Dictionary<RouteOfAdministration, List<string>>>(v, JsonOptions)!
    );

    public static readonly ValueComparer<Dictionary<RouteOfAdministration, List<string>>> DosageComparer = new(
        (d1, d2) => CompareDosages(d1, d2),
        d => GetDosageHashCode(d),
        d => CloneDosages(d)
    );

    private static bool CompareDosages(
        Dictionary<RouteOfAdministration, List<string>>? d1,
        Dictionary<RouteOfAdministration, List<string>>? d2)
    {
        if (ReferenceEquals(d1, d2))
            return true;

        if (d1 is null || d2 is null)
            return false;

        return d1.Count == d2.Count && 
               d1.All(kv => d2.TryGetValue(kv.Key, out var value) && value.SequenceEqual(kv.Value));
    }

    private static int GetDosageHashCode(Dictionary<RouteOfAdministration, List<string>> d)
    {
        var hash = new HashCode();

        foreach (var kv in d.OrderBy(x => x.Key))
        {
            hash.Add(kv.Key);
            foreach (var value in kv.Value)
            {
                hash.Add(value);
            }
        }

        return hash.ToHashCode();
    }

    private static Dictionary<RouteOfAdministration, List<string>> CloneDosages(Dictionary<RouteOfAdministration, List<string>> d)
    {
        return d.ToDictionary(x => x.Key, x => x.Value.ToList());
    }
}