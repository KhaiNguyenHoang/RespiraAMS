using System;
using System.Threading.Tasks;
using Application.Abstracts;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;

namespace Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;
        private readonly string _host;
        private readonly int _port;
        private readonly string _username;
        private readonly string _password;
        private readonly string _senderName;
        private readonly string _senderEmail;
        private readonly bool _enableSsl;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _logger = logger;
            var smtpSection = configuration.GetSection("SmtpSettings");
            _host = smtpSection.GetValue<string>("Host") ?? string.Empty;
            _port = smtpSection.GetValue<int>("Port", 587);
            _username = smtpSection.GetValue<string>("Username") ?? string.Empty;
            _password = smtpSection.GetValue<string>("Password") ?? string.Empty;
            _senderName = smtpSection.GetValue<string>("SenderName") ?? "RespiraAMS Support";
            _senderEmail = smtpSection.GetValue<string>("SenderEmail") ?? string.Empty;
            _enableSsl = smtpSection.GetValue<bool>("EnableSsl", false);
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_senderName, _senderEmail));
            message.To.Add(new MailboxAddress("", to));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = body };
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            try
            {
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                var secureSocketOptions = _enableSsl 
                    ? SecureSocketOptions.SslOnConnect 
                    : SecureSocketOptions.StartTlsWhenAvailable;

                await client.ConnectAsync(_host, _port, secureSocketOptions);

                if (!string.IsNullOrEmpty(_username) && !string.IsNullOrEmpty(_password))
                {
                    await client.AuthenticateAsync(_username, _password);
                }

                await client.SendAsync(message);
                _logger.LogInformation("Email sent successfully to {To}", to);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {To} via SMTP server {Host}:{Port}", to, _host, _port);
                throw;
            }
            finally
            {
                await client.DisconnectAsync(true);
            }
        }
    }
}
