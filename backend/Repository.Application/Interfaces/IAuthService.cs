using Repository.Domain.Entities;

namespace Repository.Application.Interfaces
{
    public interface IAuthService
    {
        Task<string> AuthenticateAsync(string username, string password);
        Task<User> RegisterAsync(string username, string email, string fullName, string password);
        Task<bool> UsernameExistsAsync(string username);
        Task<bool> EmailExistsAsync(string email);
        string HashPassword(string password);
        bool VerifyPassword(string password, string passwordHash);
    }
} 