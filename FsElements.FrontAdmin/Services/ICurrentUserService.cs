
using System.ComponentModel;

namespace FsElements.FrontAdmin.Services
{
    public interface ICurrentUserService : INotifyPropertyChanged
    {
        bool IsAuthenticated { get; }
        string? AuthToken { get; }

        Task<bool> LoginAsync(string email, string password);
        Task LogoutAsync();
    }
}