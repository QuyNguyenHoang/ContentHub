using System.Text.RegularExpressions;

public static class SeoExtensions
{
    public static string GenerateSeoDescription(string? description, string? content)
    {
        string? text = null;

        if (!string.IsNullOrWhiteSpace(description))
        {
            text = description;
        }
        else if (!string.IsNullOrWhiteSpace(content))
        {
            text = content;
        }
        else
        {
            return string.Empty;
        }

        // Remove HTML
        text = Regex.Replace(text, "<.*?>", string.Empty);

        // Normalize space
        text = Regex.Replace(text, @"\s+", " ").Trim();

        if (text.Length <= 150)
            return text;

        var cut = text.Substring(0, 150);

        int lastDot = cut.LastIndexOf('.');
        if (lastDot > 50)
            return cut.Substring(0, lastDot + 1);

        return cut + "...";
    }
}