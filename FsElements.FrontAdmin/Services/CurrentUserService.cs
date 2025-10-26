using Blazored.LocalStorage;
using FsElements.FrontAdmin.Models;
using System.ComponentModel;
using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace FsElements.FrontAdmin.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpClientFactory httpClientFactory;
        private readonly ILocalStorageService localStorage;
        private readonly ILogger<CurrentUserService> logger;
        private string? authToken;

        public event PropertyChangedEventHandler? PropertyChanged;

        public CurrentUserService(IHttpClientFactory httpClientFactory, ILocalStorageService localStorage, ILogger<CurrentUserService> logger)
        {
            this.httpClientFactory = httpClientFactory;
            this.localStorage = localStorage;
            this.logger = logger;
            LoadAuthToken();
        }

        public bool IsAuthenticated { get => !string.IsNullOrEmpty(AuthToken); }
        public string? AuthToken
        {
            get => authToken;
            private set
            {
                authToken = value;
                OnPropertyChanged(nameof(AuthToken));
                OnPropertyChanged(nameof(IsAuthenticated));
            }
        }

        private async void LoadAuthToken()
        {
            AuthToken = await localStorage.GetItemAsync<string>("authToken");
        }

        public async Task<bool> LoginAsync(string email, string password)
        {
            try
            {
                using (var client = httpClientFactory.CreateClient(HttpClients.AuthApiClient))
                {
                    var loginRequest = new
                    {
                        Email = email,
                        Password = password
                    };
                    var response = await client.PostAsJsonAsync("auth/login", loginRequest);
                    if (response.IsSuccessStatusCode)
                    {
                        var respJson = await response.Content.ReadFromJsonAsync<LoginResponse>();
                        AuthToken = respJson?.AccessToken;
                        if (AuthToken != null)
                            await localStorage.SetItemAsStringAsync("authToken", AuthToken);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Login failed for user {Email}", email);
                AuthToken = null;
            }
            return IsAuthenticated;
        }

        public async Task LogoutAsync()
        {
            await localStorage.RemoveItemAsync("authToken");
            AuthToken = null;
        }

        protected virtual void OnPropertyChanged(
        [CallerMemberName] string? propertyName = default)
            => PropertyChanged?.Invoke(this, new(propertyName));
    }
}
