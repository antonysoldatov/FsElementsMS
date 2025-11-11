using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace FsElements.Common.Extension
{
    public static class MassTransitExtensions
    {
        public static IServiceCollection AddRabbitMqMassTransit(this IServiceCollection services)
        {
            services.AddMassTransit(c =>
            {
                c.AddConsumers(Assembly.GetEntryAssembly());

                c.UsingRabbitMq((context, configurator) =>
                {
                    var configuration = context.GetRequiredService<IConfiguration>();
                    configurator.Host(configuration["RabbitMQSettings:Host"], conf => {
                        });
                    configurator.ConfigureEndpoints(context);
                });
            });

            return services;
        }
    }
}
