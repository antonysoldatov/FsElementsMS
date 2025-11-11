using FsElements.Common.MassTransit;
using FsElements.Common.Services;
using FsElements.OrdersApi.Entities;
using MassTransit;

namespace FsElements.OrdersApi.Consumers
{
    public class SellerCreatedConsumer : IConsumer<SellerCreatedMessage>
    {
        private readonly IMongoRepository<Seller> sellerRepository;

        public SellerCreatedConsumer(IMongoRepository<Seller> sellerRepository)
        {
            this.sellerRepository = sellerRepository;
        }

        public async Task Consume(ConsumeContext<SellerCreatedMessage> context)
        {
            var message = context.Message;

            var existingSeller = await sellerRepository.GetByIdAsync(message.SellerId);
            if (existingSeller != null)
            {
                return;
            }

            await sellerRepository.AddAsync(new Seller
            {
                Id = message.SellerId,
                Email = message.Email
            });
        }
    }
}
