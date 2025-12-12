
namespace FsElements.Common.Services
{
    public interface IFileManageService
    {
        Task<string> SaveFile(string fileBase64, string folder);
    }

    public static class FileFolders
    {
        public const string Forms = "Forms";
        public const string Elements = "Elements";
    }
}
