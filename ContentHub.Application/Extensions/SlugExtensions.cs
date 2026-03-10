using System.Text;
using System.Text.RegularExpressions;

public static class SlugExtensions
{
    private static readonly Regex InvalidChars =
        new Regex(@"[^a-z0-9\s-]", RegexOptions.Compiled);

    private static readonly Regex MultiSpace =
        new Regex(@"\s+", RegexOptions.Compiled);

    private static readonly Regex MultiHyphen =
        new Regex("-{2,}", RegexOptions.Compiled);

    public static string GenerateSlug(string phrase)
    {
        if (string.IsNullOrWhiteSpace(phrase))
            return string.Empty;

        string str = phrase.ToLower();

        str = RemoveDiacritics(str);

        str = InvalidChars.Replace(str, "");

        str = MultiSpace.Replace(str, "-");

        str = MultiHyphen.Replace(str, "-");

        return str.Trim('-');
    }

    private static string RemoveDiacritics(string text)
    {
        var normalized = text.Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder();

        foreach (var c in normalized)
        {
            if (System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c)
                != System.Globalization.UnicodeCategory.NonSpacingMark)
            {
                builder.Append(c);
            }
        }

        return builder.ToString().Normalize(NormalizationForm.FormC);
    }
}