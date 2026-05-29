namespace ContentHub.Application.Models.AnalyticDto
{
    public class TotalUserCountResponseDto
    {

        public int TotalUser { get; set; }
        public int PreviousTotalUser { get; set; }
        public double Growth { get; set; }

    }
}
