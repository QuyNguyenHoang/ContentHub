using System.Net;
using System.Net.Mail;

namespace ContentHub.Api.Services
{
    public class SmtpEmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;

        public SmtpEmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var port = _configuration["EmailSettings:Port"];
            var fromEmail = _configuration["EmailSettings:FromEmail"];
            var password = _configuration["EmailSettings:Password"];

            if (string.IsNullOrEmpty(smtpServer))
                throw new InvalidOperationException("SMTP Server is not configured");

            var smtp = new SmtpClient
            {
                Host = smtpServer,
                Port = int.Parse(port!),
                EnableSsl = true,
                Credentials = new NetworkCredential(fromEmail, password)
            };

            var mail = new MailMessage
            {
                From = new MailAddress(fromEmail!),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            };

            mail.To.Add(toEmail);

            await smtp.SendMailAsync(mail);
        }
    }
}
