"""
خدمة البريد الإلكتروني
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()

# إعدادات البريد
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")


class EmailService:
    """خدمة إرسال البريد الإلكتروني"""
    
    def __init__(self):
        self.smtp_host = SMTP_HOST
        self.smtp_port = SMTP_PORT
        self.smtp_user = SMTP_USER
        self.smtp_password = SMTP_PASSWORD
    
    def create_telegram_invite_email(
        self, 
        recipient_name: str, 
        team_name: str, 
        telegram_link: str
    ) -> str:
        """إنشاء محتوى البريد لدعوة تلغرام"""
        html_content = f"""
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
                    border-bottom: 2px solid #667eea;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                }}
                .header h1 {{
                    color: #667eea;
                    margin: 0;
                }}
                .content {{
                    line-height: 1.8;
                    color: #333;
                }}
                .btn {{
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 25px;
                    margin: 20px 0;
                    font-weight: bold;
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
                    <h1>🏆 مسابقات تكنوفيست</h1>
                </div>
                <div class="content">
                    <p>مرحباً <strong>{recipient_name}</strong>،</p>
                    <p>تم إضافتك إلى فريق <strong>"{team_name}"</strong> في مسابقات تكنوفيست!</p>
                    <p>يرجى الانضمام إلى مجموعة الفريق على تلغرام للتواصل مع باقي الأعضاء:</p>
                    <p style="text-align: center;">
                        <a href="{telegram_link}" class="btn">
                            📱 انضم لمجموعة تلغرام
                        </a>
                    </p>
                    <p>نتمنى لك التوفيق! 🚀</p>
                </div>
                <div class="footer">
                    <p>© 2024 منصة مسابقات تكنوفيست - جميع الحقوق محفوظة</p>
                </div>
            </div>
        </body>
        </html>
        """
        return html_content
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str
    ) -> dict:
        """إرسال بريد إلكتروني"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.smtp_user
            msg['To'] = to_email
            
            html_part = MIMEText(html_content, 'html', 'utf-8')
            msg.attach(html_part)
            
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.sendmail(self.smtp_user, to_email, msg.as_string())
            
            return {
                "success": True,
                "message": f"تم إرسال البريد إلى {to_email}"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"فشل إرسال البريد: {str(e)}"
            }
    
    async def send_telegram_invites(
        self,
        recipients: List[dict],  # [{"email": "", "name": "", "team_name": ""}]
        telegram_link: str
    ) -> dict:
        """إرسال دعوات تلغرام لعدة مستلمين"""
        results = {
            "total": len(recipients),
            "sent": 0,
            "failed": 0,
            "details": []
        }
        
        for recipient in recipients:
            html_content = self.create_telegram_invite_email(
                recipient_name=recipient.get("name", "المشارك"),
                team_name=recipient.get("team_name", ""),
                telegram_link=telegram_link
            )
            
            result = await self.send_email(
                to_email=recipient["email"],
                subject=f"🏆 دعوة للانضمام لفريق {recipient.get('team_name', '')} - تكنوفيست",
                html_content=html_content
            )
            
            if result["success"]:
                results["sent"] += 1
            else:
                results["failed"] += 1
            
            results["details"].append({
                "email": recipient["email"],
                **result
            })
        
        return results


# إنشاء نسخة من الخدمة
email_service = EmailService()
