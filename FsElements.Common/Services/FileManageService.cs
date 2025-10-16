
namespace FsElements.Common.Services
{
    public interface IFileManageService
    {
        Task<string> SaveFile(string fileBase64, string folder);
    }

    public class FileManageService : IFileManageService
    {
        public async Task<string> SaveFile(string fileBase64, string folder)
        {
            if (string.IsNullOrEmpty(fileBase64))
            {
                return null;
            }
            var ext = Base64Extension.GetExtensionFromDataUri(fileBase64);
            var fileName = Guid.NewGuid() + "." + (ext ?? "jpg");
            var dirPath = Path.Combine("Images", folder);
            var filePath = Path.Combine(dirPath, fileName);
            if (!Directory.Exists(dirPath))
            {
                Directory.CreateDirectory(dirPath);
            }
            if (fileBase64.Contains(","))
            {
                fileBase64 = fileBase64.Split(',')[1];
            }
            byte[] bytes = Convert.FromBase64String(fileBase64);
            using (var stream = File.Open(filePath, FileMode.OpenOrCreate))
            {
                await stream.WriteAsync(bytes, 0, bytes.Length);
            }
            return $"/Images/{folder}/{fileName}";
        }
    }

    public static class FileFolders
    {
        public const string Forms = "Forms";
        public const string Elements = "Elements";
    }
}
