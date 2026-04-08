namespace ApplicationService.Core.Application.ProfileService.Settings
{
    public class FileStorageSettings
    {
        public string UploadPath { get; set; }
        public string BaseUrl { get; set; }
        public long MaxFileSizeBytes { get; set; }
        public string[] AllowedExtensions { get; set; }
    }
}
