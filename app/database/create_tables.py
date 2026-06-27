from app.database.database import engine
from app.database.models import Base

import app.database.report_models

Base.metadata.create_all(bind=engine)

print("Tables Created Successfully!")