import smtplib
from email.mime.text import MIMEText
from auth_service.utils.config import config
from pydantic import EmailStr


class SMTP:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self) -> None:
        self.server: str = config.SMTP_SERVER
        self.port: int = config.SMTP_PORT
        self.sender_mail: EmailStr = config.SMTP_USER
        self.sender_password: str = config.SMTP_PASSWORD
    
    # TODO: check create MIMEText by params
    def __generare_message(self, to_email: EmailStr, subject: str, content: str) -> MIMEText:
        msg: MIMEText = MIMEText(content)
        msg['Subject'] = subject
        msg['From'] = str(self.sender_mail)
        msg['To'] = str(to_email)
        return msg
    
    def send_register_code(self, to_email: EmailStr, code: int) -> None:
        with smtplib.SMTP(self.server, self.port) as server:
            server.starttls()
            server.login(self.sender_mail, self.sender_password)
            server.send_message(self.__generare_message(
                to_email=to_email,
                subject='Registration code Bloom',
                content=str(code)
            ))


smtp: SMTP = SMTP()
