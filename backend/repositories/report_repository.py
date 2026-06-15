"""Barrier report repository backed by temporary in-memory mock data."""

from datetime import datetime, timezone

from data.mock_barrier_reports import MOCK_BARRIER_REPORTS


def list_reports() -> list[dict]:
    """Return all barrier report records."""
    return [report.copy() for report in MOCK_BARRIER_REPORTS]


def create_report(report: dict) -> dict:
    """Create a barrier report record with generated ID and default status."""
    report_number = len(MOCK_BARRIER_REPORTS) + 1
    created_report = {
        "id": f"REP-{report_number:03d}",
        "station_id": report["station_id"],
        "category": report["category"],
        "description": report.get("description"),
        "status": "open",
        "created_at": report.get("created_at") or datetime.now(timezone.utc),
    }
    MOCK_BARRIER_REPORTS.append(created_report)
    return created_report.copy()
