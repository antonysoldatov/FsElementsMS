using MongoDB.Bson;
using MongoDB.Driver;

namespace FsElements.Common.Services
{
    public class MongoRepository<T> : IMongoRepository<T> where T : BaseEntity
    {
        private readonly IMongoCollection<T> _collection;

        public MongoRepository(IMongoDatabase database)
        {
            _collection = database.GetCollection<T>(typeof(T).Name);
        }

        public async Task<List<T>> GetAllAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<T> GetByIdAsync(Guid id)
        {
            var filter = Builders<T>.Filter.Eq(g => g.Id, id);
            return await _collection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task AddAsync(T entity)
        {
            await _collection.InsertOneAsync(entity);
        }

        public async Task UpdateAsync(Guid id, T entity)
        {
            var filter = Builders<T>.Filter.Eq(g => g.Id, id);
            await _collection.ReplaceOneAsync(filter, entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            var filter = Builders<T>.Filter.Eq(g => g.Id, id);
            await _collection.DeleteOneAsync(filter);
        }
    }
}
