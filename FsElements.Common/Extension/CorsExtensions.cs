using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FsElements.Common.Extension
{
    public static class CorsExtensions
    {
        public static IServiceCollection AddCorsWithAllowClientPolicy(this IServiceCollection services, string name)
        {
            services.AddCors(options =>
            {
                //NOTE: for development purposes only. Update for production use.    
                options.AddPolicy(name,
                            builder => builder.AllowAnyOrigin()
                                              .AllowAnyMethod()
                                              .AllowAnyHeader());
                
            });
            return services;
        }
    }
}
