using NET_Apex_Stats.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;

namespace NET_Apex_Stats.Services
{
    public class MongoDBService
    {
        private readonly IMongoCollection<User> _userCollection;
        private readonly IMongoCollection<BattleRoyale> _battleRoyaleCollection;

        public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings)
        {
            MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
            IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _battleRoyaleCollection = database.GetCollection<BattleRoyale>(mongoDBSettings.Value.BattleRoyaleCollection);
            _userCollection = database.GetCollection<User>(mongoDBSettings.Value.UserCollection);
        }

        public async Task CreateAsync(BattleRoyale battleRoyale)
        {
            await _battleRoyaleCollection.InsertOneAsync(battleRoyale);
            return;
        }

        public async Task CreateUserAsync(User user)
        {
            await _userCollection.InsertOneAsync(user);
            return;
        }


        public async Task<IAsyncCursor<User>> GetUserAsync(string username)
        {
            FilterDefinition<User> filter = Builders<User>.Filter.Eq("Username", username);
            var user = await _userCollection.FindAsync(filter);
            return user;
        }

        public async Task<List<BattleRoyale>> GetAsync()
        {
            return await _battleRoyaleCollection.Find(new BsonDocument()).ToListAsync();
        }


        public async Task DeleteAsync(string id)
        {
            FilterDefinition<BattleRoyale> filter = Builders<BattleRoyale>.Filter.Eq("Id", id);
            await _battleRoyaleCollection.DeleteOneAsync(filter);
            return;
        }
    }
}
