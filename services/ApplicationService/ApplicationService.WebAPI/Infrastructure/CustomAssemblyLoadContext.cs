using System.Reflection;
using System.Runtime.Loader;

namespace ApplicationService.WebAPI.Infrastructure
{
    /// <summary>
    /// Allows DinkToPdf to load the unmanaged libwkhtmltox native library
    /// from an explicit file path rather than relying on OS PATH resolution.
    ///
    /// Usage in Program.cs (before builder.Build()):
    ///   var nativeLibPath = Path.Combine(AppContext.BaseDirectory, "libwkhtmltox.dll");
    ///   new CustomAssemblyLoadContext().LoadUnmanagedLibrary(nativeLibPath);
    /// </summary>
    public class CustomAssemblyLoadContext : AssemblyLoadContext
    {
        public IntPtr LoadUnmanagedLibrary(string absolutePath)
            => LoadUnmanagedDll(absolutePath);

        protected override IntPtr LoadUnmanagedDll(string unmanagedDllName)
            => LoadUnmanagedDllFromPath(unmanagedDllName);

        protected override Assembly? Load(AssemblyName assemblyName) => null;
    }
}
