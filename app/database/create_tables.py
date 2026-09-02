from app.database.database import engine
from app.database.base import Base

import app.database.models
import app.database.report_models
import app.database.analysis_models

Base.metadata.create_all(bind=engine)

print("Tables Created Successfully!")