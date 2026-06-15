"""Router for anonymous barrier reports."""

from fastapi import APIRouter, HTTPException, status

from schemas.report_schema import BarrierReportCreate, BarrierReportResponse
from services import report_service

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post(
    "",
    response_model=BarrierReportResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_report(report: BarrierReportCreate) -> BarrierReportResponse:
    """Create an anonymous barrier report for an existing station."""
    try:
        return report_service.create_report(report)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("", response_model=list[BarrierReportResponse])
def list_reports() -> list[BarrierReportResponse]:
    """List anonymous barrier reports."""
    return report_service.list_reports()
