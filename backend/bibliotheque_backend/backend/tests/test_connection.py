from sqlalchemy import text

from tests.conftest import TestingSessionLocal


def test_database_connection():
    db = TestingSessionLocal()

    try:
        result = db.execute(text("SELECT 1"))

        assert result.scalar() == 1

    finally:
        db.close()