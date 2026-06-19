using Application.Abstracts;
using System.Net;
using System.Net.Http.Json;
using Application.DTOs;

namespace Infrastructure.Services
{
    public class DoctorServiceClient(HttpClient httpClient) : IDoctorServiceClient
    {
        private readonly HttpClient _httpClient = httpClient;

        public async Task<DoctorProfileDto?> GetDoctorProfileAsync(Guid doctorId)
        {
            var response = await _httpClient.GetAsync($"/api/1.0/doctor/{doctorId}");
            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<DoctorProfileDto>();
        }

        public async Task<Dictionary<Guid, DoctorProfileDto>> GetDoctorProfilesBatchAsync(IReadOnlyList<Guid> doctorIds)
        {
            var response = await _httpClient.PostAsJsonAsync("/api/1.0/doctor/batch", doctorIds);
            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadFromJsonAsync<Dictionary<Guid, DoctorProfileDto>>();
            return result ?? [];
        }
    }
}
