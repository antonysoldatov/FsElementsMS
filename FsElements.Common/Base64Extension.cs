using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FsElements.Common
{
    public class Base64Extension
    {
        public static Stream ConvertBase64ToStream(string base64String)
        {
            // 1. Decode the Base64 string into a byte array.
            // Convert.FromBase64String handles the decoding.
            byte[] bytes = Convert.FromBase64String(base64String);

            // 2. Create a MemoryStream from the byte array.
            // MemoryStream is a stream implementation that uses an in-memory byte array as its backing store.
            MemoryStream stream = new MemoryStream(bytes);

            return stream;
        }

        public static string GetExtensionFromDataUri(string base64DataUri)
        {
            Match match = Regex.Match(base64DataUri, @"data:(?<mime>[\w/\-\.]+);base64,");
            if (match.Success)
            {
                string mimeType = match.Groups["mime"].Value;
                return MimeTypeToExtension(mimeType);
            }
            return null; // Or throw an exception
        }

        private static string MimeTypeToExtension(string mimeType)
        {
            switch (mimeType)
            {
                case "image/png": return "png";
                case "image/jpeg": return "jpg";
                case "application/pdf": return "pdf";
                // Add more mappings as needed
                default: return null; // Or "bin" for unknown types
            }
        }
    }
}
