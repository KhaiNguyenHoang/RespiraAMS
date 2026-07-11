using Application.Abstracts.Caching;
using ZiggyCreatures.Caching.Fusion;

namespace Infrastructure.Caching
{
    public class CacheService(IFusionCache cache) : ICacheService
    {
        public async Task<T?> GetAsync<T>(string key)
        {
            var value = await cache.TryGetAsync<T>(key);
            return value.HasValue ? value.Value : default;
        }

        public async Task RemoveAsync(string key)
        {
            await cache.RemoveAsync(key);
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
        {
            if (expiration is null)
            {
                await cache.SetAsync(key, value);
            }
            else
            {
                await cache.SetAsync(key, value, expiration.Value);
            }
        }
    }
}
