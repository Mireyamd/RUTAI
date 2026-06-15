"""Business logic for anonymous barrier reports."""

from repositories import report_repository, station_repository
from schemas.report_schema import BarrierReportCreate, BarrierReportResponse


def list_reports() -> list[BarrierReportResponse]:
    """Return all barrier reports."""
    return [
        BarrierReportResponse(**report)
        for report in report_repository.list_reports()
    ]


def create_report(report: BarrierReportCreate) -> BarrierReportResponse:
    """Create a barrier report after validating the station exists."""
    if station_repository.get_station_by_id(report.station_id) is None:
        raise ValueError("Station not found")

    created_report = report_repository.create_report(report.model_dump())
    return BarrierReportResponse(**created_report)
