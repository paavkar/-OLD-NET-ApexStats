using System;
using Microsoft.AspNetCore.Mvc;
using NET_Apex_Stats.Services;
using NET_Apex_Stats.Models;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NET_Apex_Stats.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BattleRoyaleController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;

        public BattleRoyaleController(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;
        }

        // GET: api/<BattleRoyaleController>
        [HttpGet]
        public async Task<List<BattleRoyale>> Get()
        {
            return await _mongoDBService.GetAsync();
        }

        // GET api/<BattleRoyaleController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<BattleRoyaleController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] BattleRoyale battleRoyale)
        {
            await _mongoDBService.CreateAsync(battleRoyale);
            return CreatedAtAction(nameof(Get), new { id = battleRoyale.Id, battleRoyale });
        }

        // PUT api/<BattleRoyaleController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<BattleRoyaleController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _mongoDBService.DeleteAsync(id);
            return NoContent();
        }
    }
}
