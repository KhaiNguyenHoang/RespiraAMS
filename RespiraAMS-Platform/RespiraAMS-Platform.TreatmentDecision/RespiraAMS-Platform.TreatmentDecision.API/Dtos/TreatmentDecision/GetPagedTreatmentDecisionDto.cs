namespace RespiraAMS_Platform.TreatmentDecision.API.Dtos.TreatmentDecision;

public class GetPagedTreatmentDecisionDto
{
    /// <summary>
    /// Page index. Must be a positive integer
    /// </summary>
    public int Page { get; set; } = 1;
    /// <summary>
    /// Page size. Must be a positive integer and less than or equal to 100
    /// </summary>
    public int Size { get; set; } = 10;
}