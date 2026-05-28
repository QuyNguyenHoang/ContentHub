
public class DateRangeResolver
{
    public (DateTime? from, DateTime? to) Resolve(TimeRange range)
    {
        var now = DateTime.UtcNow;

        return range switch
        {
            TimeRange.AllTime => (null, null),

            TimeRange.Today =>
                (now.Date, now),

            TimeRange.Last7Days =>
                (now.AddDays(-7), now),

            TimeRange.Last30Days =>
                (now.AddDays(-30), now),

            TimeRange.Last90Days =>
                (now.AddDays(-90), now),

            TimeRange.ThisMonth =>
                (new DateTime(now.Year, now.Month, 1), now),

            TimeRange.LastMonth =>
                (new DateTime(now.AddMonths(-1).Year, now.AddMonths(-1).Month, 1),
                 new DateTime(now.Year, now.Month, 1).AddDays(-1)),

            TimeRange.ThisYear =>
                (new DateTime(now.Year, 1, 1), now),

            TimeRange.LastYear =>
                (new DateTime(now.Year - 1, 1, 1),
                 new DateTime(now.Year - 1, 12, 31)),

            _ => (null, null)
        };
    }
}
public enum TimeRange
{
    AllTime = 0,
    Today = 1,
    Last7Days = 2,
    Last30Days = 3,
    Last90Days = 4,
    ThisMonth = 5,
    LastMonth = 6,
    ThisYear = 7,
    LastYear = 8
}


