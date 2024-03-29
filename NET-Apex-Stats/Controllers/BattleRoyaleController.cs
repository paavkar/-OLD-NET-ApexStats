﻿using System;
using Microsoft.AspNetCore.Mvc;
using NET_Apex_Stats.Services;
using NET_Apex_Stats.Models;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver.Linq;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NET_Apex_Stats.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BattleRoyaleController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BattleRoyaleController(MongoDBService mongoDBService, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _mongoDBService = mongoDBService;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        // GET: api/<BattleRoyaleController>
        [HttpGet]
        public async Task<List<BattleRoyale>> Get()
        {
            string userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Sid);
            return await _mongoDBService.GetAsync(userId);
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
            string userId = "";
            if (Request.Headers.TryGetValue("Authorization", out var authorization))
            {
                try
                {
                    userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Sid);
                    battleRoyale.userId = userId;
                    await _mongoDBService.CreateAsync(battleRoyale);
                    return CreatedAtAction(nameof(Get), new { id = battleRoyale.Id, battleRoyale });
                }
                catch
                {
                    return Unauthorized("Invalid or missing token");
                }
            }
            return Unauthorized("Invalid or missing token");
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
            string userId = "";
            if (Request.Headers.TryGetValue("Authorization", out var authorization))
            {
                try
                {
                    userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Sid);
                    await _mongoDBService.DeleteAsync(id, userId);
                    return NoContent();
                }
                catch
                {
                    return Unauthorized("Invalid or missing token");
                }
            }
            return Unauthorized("Invalid or missing token");
        }
    }
}
