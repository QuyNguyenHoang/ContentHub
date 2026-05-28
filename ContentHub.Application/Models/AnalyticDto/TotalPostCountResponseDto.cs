namespace ContentHub.Application.Models.AnalyticDto
{
    public class TotalPostCountResponseDto
    {
        public int TotalPost { get; set; }
        public int PreviousTotalPost { get; set; }
        public double Growth { get; set; }
    }
}
