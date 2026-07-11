using Application.Features.Statistics;

namespace RespiraAMS_Platform.TreatmentDecision.API.Dtos.Statistics;

public class StatisticsDto
{
    /// <summary>
    /// Doctor ID for personal analysis
    /// </summary>
    public Guid? DoctorId { get; set; }

    /// <summary>
    /// The month for analyzing. Default to the current month
    /// </summary>
    public int Month { get; set; } = DateTimeOffset.UtcNow.Month;

    /// <summary>
    /// The year for analyzing. Default to the current year
    /// </summary>
    public int Year { get; set; } = DateTimeOffset.UtcNow.Year;

    public GetStatisticsQuery ToQuery()
    {
        return new GetStatisticsQuery
        {
            DoctorId = DoctorId,
            Month = Month,
            Year = Year,
        };
    }
}