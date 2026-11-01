import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.base import Base
from app.database.database import get_db
from app.api.auth import get_password_hash
from app.database.models import User
from app.database.report_models import BloodReport
from app.database.analysis_models import ReportAnalysis

# In-memory SQLite for isolated, fast testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database for each test function."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    """Override get_db with test database session."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db_session):
    """Seed a standard patient user."""
    user = User(
        username="testpatient",
        name="Test Patient",
        email="patient@example.com",
        hashed_password=get_password_hash("password123"),
        role="patient",
        is_active="active"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_doctor(db_session):
    """Seed a clinic doctor user."""
    doctor = User(
        username="testdoctor",
        name="Dr. Smith",
        email="doctor@example.com",
        hashed_password=get_password_hash("doctor123"),
        role="doctor",
        is_active="active"
    )
    db_session.add(doctor)
    db_session.commit()
    db_session.refresh(doctor)
    return doctor


@pytest.fixture
def test_admin(db_session):
    """Seed an administrator user."""
    admin = User(
        username="testadmin",
        name="Admin User",
        email="admin@example.com",
        hashed_password=get_password_hash("admin123"),
        role="admin",
        is_active="active"
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return admin


@pytest.fixture
def test_report(db_session, test_user):
    """Seed a sample blood report belonging to test_user."""
    report = BloodReport(
        patient_name="John Doe",
        user_id=test_user.id,
        original_filename="sample_report.pdf",
        stored_filename="stored_sample.pdf"
    )
    db_session.add(report)
    db_session.commit()
    db_session.refresh(report)

    analysis = ReportAnalysis(
        report_id=report.id,
        ocr_text="Hemoglobin 14.5 g/dL WBC 7500 /cumm Platelets 250000",
        parameters={"hemoglobin": 14.5, "wbc": 7500.0, "platelets": 250000.0},
        analysis={
            "Hemoglobin": {"value": "14.5 g/dL", "status": "normal", "reference_range": "13.0 - 17.0"},
            "WBC": {"value": "7500 /cumm", "status": "normal", "reference_range": "4000 - 11000"},
            "Platelets": {"value": "250000", "status": "normal", "reference_range": "150000 - 450000"}
        },
        ai_summary="All parameters are within normal physiological limits."
    )
    db_session.add(analysis)
    db_session.commit()
    db_session.refresh(analysis)
    return report


@pytest.fixture
def test_second_report(db_session, test_user):
    """Seed a second report for the same patient to enable comparison and trends."""
    report = BloodReport(
        patient_name="John Doe",
        user_id=test_user.id,
        original_filename="followup_report.pdf",
        stored_filename="stored_followup.pdf"
    )
    db_session.add(report)
    db_session.commit()
    db_session.refresh(report)

    analysis = ReportAnalysis(
        report_id=report.id,
        ocr_text="Hemoglobin 11.2 g/dL WBC 7200 /cumm Platelets 240000",
        parameters={"hemoglobin": 11.2, "wbc": 7200.0, "platelets": 240000.0},
        analysis={
            "Hemoglobin": {"value": "11.2 g/dL", "status": "low", "reference_range": "13.0 - 17.0"},
            "WBC": {"value": "7200 /cumm", "status": "normal", "reference_range": "4000 - 11000"},
            "Platelets": {"value": "240000", "status": "normal", "reference_range": "150000 - 450000"}
        },
        ai_summary="Mild anemia observed with reduced hemoglobin levels."
    )
    db_session.add(analysis)
    db_session.commit()
    db_session.refresh(analysis)
    return report
