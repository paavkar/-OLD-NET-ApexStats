using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace NET_Apex_Stats.Models
{
    public class BattleRoyale
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string season { get; set; } = null!;

        public int games { get; set; }

        public int wins { get; set; }

        public int kills { get; set; }

        public int kdr { get; set; }

        public int avgDamage { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string? userId { get; set; }
    }
}
