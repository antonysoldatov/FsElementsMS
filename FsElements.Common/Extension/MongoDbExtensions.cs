using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FsElements.Common.Extension
{
    public static class MongoDbExtensions
    {
        public static IServiceCollection AddMongoClientWithDatabase(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IMongoClient>(s => new MongoClient(configuration.GetValue<string>("MongoDbSettings:ConnectionString")));
            services.AddSingleton<IMongoDatabase>(s =>
            {
                var client = s.GetRequiredService<IMongoClient>();
                return client.GetDatabase(configuration.GetValue<string>("MongoDbSettings:DatabaseName")!);
            });
            return services;
        }
    }
}
