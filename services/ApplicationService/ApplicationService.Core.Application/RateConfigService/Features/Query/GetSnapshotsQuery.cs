using ApplicationService.Core.Application.RateConfigService.DTOs;
using ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories;
using MediatR;
using System.Text.Json;

namespace ApplicationService.Core.Application.RateConfigService.Features.Query
{
    // ── List snapshots for a region ───────────────────────────────────────────

    public class GetSnapshotsQuery : IRequest<List<RateConfigSnapshotDto>>
    {
        public string Region { get; set; } = string.Empty;

        public class Handler : IRequestHandler<GetSnapshotsQuery, List<RateConfigSnapshotDto>>
        {
            private readonly IRateConfigRepository _repo;
            public Handler(IRateConfigRepository repo) => _repo = repo;

            public async Task<List<RateConfigSnapshotDto>> Handle(
                GetSnapshotsQuery request, CancellationToken ct)
            {
                var snapshots = await _repo.GetSnapshotsAsync(request.Region.ToUpper());

                return snapshots.Select(s => new RateConfigSnapshotDto
                {
                    Id           = s.Id,
                    Region       = s.Region,
                    Label        = s.Label,
                    SnapshotType = s.SnapshotType,
                    CreatedBy    = s.CreatedBy ?? string.Empty,
                    CreatedAt    = s.CreatedAt,
                    // ChangeLogs intentionally empty on list view
                }).ToList();
            }
        }
    }

    // ── Single snapshot with full change-log detail ───────────────────────────

    public class GetSnapshotByIdQuery : IRequest<RateConfigSnapshotDto>
    {
        public string SnapshotId { get; set; } = string.Empty;

        public class Handler : IRequestHandler<GetSnapshotByIdQuery, RateConfigSnapshotDto>
        {
            private readonly IRateConfigRepository _repo;
            public Handler(IRateConfigRepository repo) => _repo = repo;

            public async Task<RateConfigSnapshotDto> Handle(
                GetSnapshotByIdQuery request, CancellationToken ct)
            {
                var s = await _repo.GetSnapshotByIdAsync(request.SnapshotId)
                    ?? throw new KeyNotFoundException($"Snapshot '{request.SnapshotId}' not found.");

                return new RateConfigSnapshotDto
                {
                    Id           = s.Id,
                    Region       = s.Region,
                    Label        = s.Label,
                    SnapshotType = s.SnapshotType,
                    CreatedBy    = s.CreatedBy ?? string.Empty,
                    CreatedAt    = s.CreatedAt,
                    ChangeLogs   = ParseChangeLogs(s.ChangeLogsJson),
                };
            }

            private static List<RateConfigChangeLogDto> ParseChangeLogs(string? json)
            {
                if (string.IsNullOrWhiteSpace(json)) return new();
                try
                {
                    return JsonSerializer.Deserialize<List<RateConfigChangeLogDto>>(json,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();
                }
                catch { return new(); }
            }
        }
    }

    // ── Paginated field-level change log for a region ─────────────────────────

    public class GetChangeLogsQuery : IRequest<List<RateConfigChangeLogDto>>
    {
        public string Region   { get; set; } = string.Empty;
        public int    Page     { get; set; } = 1;
        public int    PageSize { get; set; } = 50;

        public class Handler : IRequestHandler<GetChangeLogsQuery, List<RateConfigChangeLogDto>>
        {
            private readonly IRateConfigRepository _repo;
            public Handler(IRateConfigRepository repo) => _repo = repo;

            public async Task<List<RateConfigChangeLogDto>> Handle(
                GetChangeLogsQuery request, CancellationToken ct)
            {
                var page     = Math.Max(1, request.Page);
                var pageSize = Math.Clamp(request.PageSize, 1, 200);

                // Change logs are now embedded in each snapshot's ChangeLogsJson.
                // Collect all logs for the region across all snapshots, then paginate.
                var snapshots = await _repo.GetSnapshotsAsync(request.Region.ToUpper());

                var allLogs = snapshots
                    .SelectMany(s => ParseChangeLogs(s.ChangeLogsJson))
                    .OrderByDescending(l => l.ChangedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                return allLogs;
            }

            private static List<RateConfigChangeLogDto> ParseChangeLogs(string? json)
            {
                if (string.IsNullOrWhiteSpace(json)) return new();
                try
                {
                    return JsonSerializer.Deserialize<List<RateConfigChangeLogDto>>(json,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();
                }
                catch { return new(); }
            }
        }
    }
}
