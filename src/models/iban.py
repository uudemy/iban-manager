from datetime import datetime
from src.models.shared_db import db
import re

class IBAN(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    iban_number = db.Column(db.String(34), unique=True, nullable=False)
    bank_name = db.Column(db.String(100), nullable=False)
    account_holder = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<IBAN {self.iban_number}>'

    def to_dict(self):
        return {
            'id': self.id,
            'iban_number': self.iban_number,
            'bank_name': self.bank_name,
            'account_holder': self.account_holder,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    @staticmethod
    def validate_iban(iban):
        """IBAN numarasını doğrula"""
        if not iban:
            return False
        
        # Boşlukları kaldır ve büyük harfe çevir
        iban = iban.replace(' ', '').upper()
        
        # Uzunluk kontrolü
        if len(iban) < 15 or len(iban) > 34:
            return False
        
        # Format kontrolü (ilk 4 karakter: 2 harf + 2 rakam)
        if not re.match(r'^[A-Z]{2}[0-9]{2}', iban):
            return False
        
        # Mod 97 kontrolü
        try:
            # IBAN'ı yeniden düzenle: son 4 karakteri başa al
            rearranged = iban[4:] + iban[:4]
            
            # Harfleri sayılara çevir (A=10, B=11, ..., Z=35)
            numeric_string = ''
            for char in rearranged:
                if char.isalpha():
                    numeric_string += str(ord(char) - ord('A') + 10)
                else:
                    numeric_string += char
            
            # Mod 97 hesapla
            return int(numeric_string) % 97 == 1
        except:
            return False

    @staticmethod
    def format_iban(iban):
        """IBAN'ı format et (4'lü gruplar halinde)"""
        if not iban:
            return iban
        
        iban = iban.replace(' ', '').upper()
        return ' '.join([iban[i:i+4] for i in range(0, len(iban), 4)])
