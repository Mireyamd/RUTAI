"""Temporary in-memory storage for barrier reports.

This keeps Sprint 1 report endpoints usable before the Supabase/PostgreSQL
tables exist. It intentionally stores no personal data.
"""

MOCK_BARRIER_REPORTS: list[dict] = []
