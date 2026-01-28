"""
مسارات البريد الإلكتروني
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from database import get_db
from models import Team, Individual, TeamMember
from services.auth_service import get_current_admin
from services.email_service import email_service

router = APIRouter(prefix="/api/email", tags=["البريد الإلكتروني"])


class EmailSendRequest(BaseModel):
    """طلب إرسال بريد إلكتروني"""
    recipient_emails: List[str]
    subject: str
    content: str
    telegram_link: Optional[str] = None


class TelegramInviteRequest(BaseModel):
    """طلب إرسال دعوة تلغرام"""
    team_id: int
    telegram_link: str


@router.post("/send")
async def send_email(
    request: EmailSendRequest,
    current_admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    إرسال بريد إلكتروني
    - يمكن إرسال لعدة مستلمين
    - إذا تم تقديم رابط تلغرام، سيتم استخدام قالب خاص
    """
    results = {
        "total": len(request.recipient_emails),
        "sent": 0,
        "failed": 0,
        "details": []
    }

    for email in request.recipient_emails:
        # البحث عن اسم المستلم من قاعدة البيانات
        recipient_name = "المشارك"

        # البحث في الأفراد
        individual = db.query(Individual).filter(Individual.email == email).first()
        if individual:
            recipient_name = individual.full_name
        else:
            # البحث في أعضاء الفرق
            team_member = db.query(TeamMember).filter(TeamMember.email == email).first()
            if team_member:
                recipient_name = team_member.full_name

        # إنشاء محتوى البريد
        if request.telegram_link:
            html_content = create_telegram_email_template(
                recipient_name=recipient_name,
                telegram_link=request.telegram_link
            )
            subject = "دعوة للانضمام إلى مجموعة تلغرام - مطبخ تكنوفيست مع ابتكار"
        else:
            html_content = create_general_email_template(
                recipient_name=recipient_name,
                content=request.content
            )
            subject = request.subject

        result = await email_service.send_email(
            to_email=email,
            subject=subject,
            html_content=html_content
        )

        if result["success"]:
            results["sent"] += 1
        else:
            results["failed"] += 1

        results["details"].append({
            "email": email,
            "name": recipient_name,
            **result
        })

    return results


@router.post("/send-telegram-invite")
async def send_telegram_invite(
    request: TelegramInviteRequest,
    current_admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    إرسال دعوة تلغرام لجميع أعضاء فريق معين
    """
    team = db.query(Team).filter(Team.id == request.team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="الفريق غير موجود")

    # جمع بيانات أعضاء الفريق من جدول TeamMember
    members = []
    for member in team.members:
        members.append({
            "email": member.email,
            "name": member.full_name,
            "team_name": team.team_name
        })

    if not members:
        raise HTTPException(status_code=400, detail="لا يوجد أعضاء في الفريق")

    # إرسال الدعوات
    results = {
        "team_id": team.id,
        "team_name": team.team_name,
        "total": len(members),
        "sent": 0,
        "failed": 0,
        "details": []
    }

    for member in members:
        html_content = create_telegram_email_template(
            recipient_name=member["name"],
            telegram_link=request.telegram_link
        )

        result = await email_service.send_email(
            to_email=member["email"],
            subject="دعوة للانضمام إلى مجموعة تلغرام - مطبخ تكنوفيست مع ابتكار",
            html_content=html_content
        )

        if result["success"]:
            results["sent"] += 1
        else:
            results["failed"] += 1

        results["details"].append({
            "email": member["email"],
            "name": member["name"],
            **result
        })

    return results


def create_telegram_email_template(recipient_name: str, telegram_link: str) -> str:
    """إنشاء قالب البريد لدعوة تلغرام"""
    return f"""
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
                direction: rtl;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            .header {{
                text-align: center;
                border-bottom: 2px solid #FF6B00;
                padding-bottom: 20px;
                margin-bottom: 20px;
            }}
            .header h1 {{
                color: #FF6B00;
                margin: 0;
                font-size: 24px;
            }}
            .content {{
                line-height: 2;
                color: #333;
                font-size: 16px;
            }}
            .content p {{
                margin: 10px 0;
            }}
            .btn {{
                display: inline-block;
                background: linear-gradient(135deg, #FF6B00 0%, #FF8C42 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                margin: 20px 0;
                font-weight: bold;
                font-size: 16px;
            }}
            .btn:hover {{
                background: linear-gradient(135deg, #E55A00 0%, #FF7A30 100%);
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #888;
                font-size: 12px;
            }}
            .greeting {{
                color: #FF6B00;
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏆 مطبخ تكنوفيست مع ابتكار</h1>
            </div>
            <div class="content">
                <p>السلام عليكم ورحمة الله</p>
                <p>حياكم الله يا <span class="greeting">{recipient_name}</span></p>
                <p>أهلا وسهلا بكم في مطبخ تكنوفيست مع ابتكار</p>
                <p>مرفق لكم رابط الانضمام إلى مجموعة التلغرام الخاصة بكم</p>
                <p style="text-align: center;">
                    <a href="{telegram_link}" class="btn">
                        📱 رابط مجموعة التلغرام هنا
                    </a>
                </p>
                <p>دمتم بخير</p>
            </div>
            <div class="footer">
                <p>© 2026 مطبخ تكنوفيست مع ابتكار - جميع الحقوق محفوظة</p>
            </div>
        </div>
    </body>
    </html>
    """


def create_general_email_template(recipient_name: str, content: str) -> str:
    """إنشاء قالب بريد عام"""
    return f"""
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
                direction: rtl;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            .header {{
                text-align: center;
                border-bottom: 2px solid #FF6B00;
                padding-bottom: 20px;
                margin-bottom: 20px;
            }}
            .header h1 {{
                color: #FF6B00;
                margin: 0;
            }}
            .content {{
                line-height: 1.8;
                color: #333;
                font-size: 16px;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #888;
                font-size: 12px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏆 مطبخ تكنوفيست مع ابتكار</h1>
            </div>
            <div class="content">
                <p>مرحباً <strong>{recipient_name}</strong>،</p>
                <div>{content}</div>
            </div>
            <div class="footer">
                <p>© 2026 مطبخ تكنوفيست مع ابتكار - جميع الحقوق محفوظة</p>
            </div>
        </div>
    </body>
    </html>
    """
