using FsElements.Common.MassTransit;
using FsElements.Common.Services;
using FsElements.OrdersApi.Entities;
using MassTransit;

namespace FsElements.OrdersApi.Consumers
{
    public class ElementAddOrEditConsumer : IConsumer<ElementAddOrEditMessage>
    {
        private readonly IMongoRepository<Element> elementRepository;

        public ElementAddOrEditConsumer(IMongoRepository<Element> elementRepository)
        {
            this.elementRepository = elementRepository;
        }

        public async Task Consume(ConsumeContext<ElementAddOrEditMessage> context)
        {
            var message = context.Message;
            var element = new Element
            {
                Id = message.ElementId,
                UniqueCode = message.UniqueCode,
                Name = message.Name
            };
            var existing = await elementRepository.GetByIdAsync(message.ElementId);
            if (existing == null)
            {
                await elementRepository.AddAsync(element);
            }
            else
            {
                await elementRepository.UpdateAsync(element.Id, element);
            }
        }
    }
}
