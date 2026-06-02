using Application.Abstracts.Caching;
using ZiggyCreatures.Caching.Fusion;

namespace Infrastructure.Caching
{
    public class CacheService(IFusionCache cache) : ICacheService
    {
        private readonly IFusionCache _cache = cache;

        public async Task<T> GetAsync<T>(string key)
        {
            return await _cache.TryGetAsync<T>(key);
        }

        public async Task RemoveAsync(string key)
        {
            await _cache.RemoveAsync(key);
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
        {
            if (expiration is null)
            {
                await _cache.SetAsync(key, value);
            }
            else
            {
                await _cache.SetAsync(key, value, expiration.Value);
            }
        }
    }
}
