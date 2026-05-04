from __future__ import annotations

import logging
import smtplib
from email.message import EmailMessage

from app.config import get_settings
from app.models import AccessRequest, ContactMessage, RFQRequest

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self) -> None:
        self.settings = get_settings()

    def _send(self, to_email: str, subject: str, body: str) -> None:
        if not self.settings.email_enabled:
            logger.info("EMAIL_DISABLED to=%s subject=%s body=%s", to_email, subject, body)
            return

        if not self.settings.smtp_host:
            logger.warning("EMAIL_ENABLED=true but SMTP_HOST is empty; email not sent.")
            return

        msg = EmailMessage()
        msg["From"] = self.settings.email_from
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.set_content(body)

        with smtplib.SMTP(self.settings.smtp_host, self.settings.smtp_port) as server:
            if self.settings.smtp_use_tls:
                server.starttls()
            if self.settings.smtp_username and self.settings.smtp_password:
                server.login(self.settings.smtp_username, self.settings.smtp_password)
            server.send_message(msg)

    def send_customer_rfq_confirmation(self, rfq: RFQRequest) -> None:
        subject = "Nexum has received your compute pricing request"
        body = f"""Hi {rfq.contact_name},

We have received your compute pricing request.

Request ID: {rfq.id}
Request type: {rfq.request_type}
Product: {rfq.product_slug or "Not specified"}
Model: {rfq.model_name or "Not specified"}
Region: {rfq.region or "Not specified"}

Our team will review the requirement and respond with available options.

Nexum Team
"""
        self._send(rfq.contact_email, subject, body)

    def send_internal_rfq_alert(self, rfq: RFQRequest) -> None:
        if not self.settings.internal_alert_email:
            logger.info("No INTERNAL_ALERT_EMAIL configured. RFQ alert skipped: %s", rfq.id)
            return

        subject = f"New Nexum RFQ: {rfq.company_name or rfq.contact_name}"
        body = f"""New RFQ received.

ID: {rfq.id}
Company: {rfq.company_name or "N/A"}
Contact: {rfq.contact_name} <{rfq.contact_email}>
Channel: {rfq.contact_channel or "N/A"}
Type: {rfq.request_type}
Product: {rfq.product_slug or "N/A"}
Model: {rfq.model_name or "N/A"}
Package quantity: {rfq.package_quantity or "N/A"}
Input tokens/month: {rfq.input_tokens_per_month or "N/A"}
Output tokens/month: {rfq.output_tokens_per_month or "N/A"}
GPU type: {rfq.gpu_type or "N/A"}
Region: {rfq.region or "N/A"}
Budget USD: {rfq.budget_usd or "N/A"}
Use case: {rfq.use_case or "N/A"}
Notes: {rfq.notes or "N/A"}
"""
        self._send(self.settings.internal_alert_email, subject, body)

    def send_internal_access_alert(self, access: AccessRequest) -> None:
        if not self.settings.internal_alert_email:
            logger.info("No INTERNAL_ALERT_EMAIL configured. Access alert skipped: %s", access.id)
            return
        subject = f"New Nexum access request: {access.company_name or access.name}"
        body = f"""New access request received.

ID: {access.id}
Name: {access.name}
Company: {access.company_name or "N/A"}
Email: {access.email}
Role: {access.role or "N/A"}
Interest: {access.interest or "N/A"}
Requested product: {access.requested_product_slug or "N/A"}
Message: {access.message or "N/A"}
"""
        self._send(self.settings.internal_alert_email, subject, body)

    def send_internal_contact_alert(self, message: ContactMessage) -> None:
        if not self.settings.internal_alert_email:
            logger.info("No INTERNAL_ALERT_EMAIL configured. Contact alert skipped: %s", message.id)
            return
        subject = f"New Nexum contact message: {message.topic or 'General'}"
        body = f"""New contact message received.

ID: {message.id}
Email: {message.email}
Topic: {message.topic or "N/A"}
Message:
{message.message}
"""
        self._send(self.settings.internal_alert_email, subject, body)
