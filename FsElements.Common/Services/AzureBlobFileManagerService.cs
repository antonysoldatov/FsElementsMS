using Azure.Storage.Blobs;
using Microsoft.Extensions.Options;

namespace FsElements.Common.Services
{
    public class AzureBlobFileManagerService : IFileManageService
    {
        private readonly AzureBlobSettings settings;

        public AzureBlobFileManagerService(IOptions<AzureBlobSettings> options)
        {
            this.settings = options.Value;
        }

        public async Task<string> SaveFile(string fileBase64, string folder)
        {
            try
            {                
                var blobServiceClient = new BlobServiceClient(settings.ConnectionString);

                var containerClient = blobServiceClient.GetBlobContainerClient(settings.ContainerName);

                var ext = Base64Extension.GetExtensionFromDataUri(fileBase64);
                var fileName = folder + "-" + Guid.NewGuid() + "." + (ext ?? "jpg");
                if (fileBase64.Contains(","))
                {
                    fileBase64 = fileBase64.Split(',')[1];
                }

                var blobClient = containerClient.GetBlobClient(fileName);
                byte[] bytes = Convert.FromBase64String(fileBase64);
                await blobClient.UploadAsync(BinaryData.FromBytes(bytes));

                return blobClient.Uri.ToString() + "?" + settings.SasKey;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }

    public class AzureBlobSettings
    { 
        public string? ConnectionString { get; set; }
        public string? ContainerName { get; set; }
        public string? SasKey { get; set; }
    }
}
