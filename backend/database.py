"""
إعدادات قاعدة البيانات PostgreSQL
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# رابط قاعدة البيانات
DATABASE_URL = os.getenv(
    "DATABASE_URL"
)

# إنشاء محرك قاعدة البيانات
engine = create_engine(DATABASE_URL)

# إنشاء جلسة
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# القاعدة للنماذج
Base = declarative_base()


def get_db():
    """الحصول على جلسة قاعدة البيانات"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """تهيئة قاعدة البيانات وإنشاء الجداول"""
    from models import (
        Admin, Team, TeamMember, Individual,
        ProjectSubmission, Evaluation, ProgramVersion, EmailLog
    )
    Base.metadata.create_all(bind=engine)
    print("✅ تم إنشاء جميع الجداول بنجاح")
    