from flask import Blueprint, request, jsonify
import logging
from src.models.iban import IBAN, db

iban_bp = Blueprint('iban', __name__)

@iban_bp.route('/test', methods=['GET'])
def test_endpoint():
    """Test endpoint"""
    return jsonify({
        'success': True,
        'message': 'IBAN routes are working',
        'database_status': 'unknown'
    })

@iban_bp.route('/ibans', methods=['GET'])
def get_ibans():
    """Tüm IBAN kayıtlarını getir"""
    try:
        logger = logging.getLogger(__name__)
        logger.info("GET /ibans endpoint called")
        
        # Database bağlantısını test et
        try:
            db.engine.connect()
            logger.info("Database connection successful")
        except Exception as db_error:
            logger.error(f"Database connection failed: {db_error}")
            return jsonify({
                'success': False,
                'error': 'Veritabanı bağlantısı kurulamadı'
            }), 500
        
        ibans = IBAN.query.order_by(IBAN.created_at.desc()).all()
        logger.info(f"Found {len(ibans)} IBANs in database")
        
        return jsonify({
            'success': True,
            'data': [iban.to_dict() for iban in ibans]
        })
    except Exception as e:
        logger.error(f"Error in get_ibans: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@iban_bp.route('/ibans', methods=['POST'])
def create_iban():
    """Yeni IBAN kaydı oluştur"""
    try:
        data = request.get_json()
        
        # Gerekli alanları kontrol et
        required_fields = ['iban_number', 'bank_name', 'account_holder']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'error': f'{field} alanı gereklidir'
                }), 400
        
        # IBAN formatını temizle
        iban_number = data['iban_number'].replace(' ', '').upper()
        
        # IBAN doğrulaması
        if not IBAN.validate_iban(iban_number):
            return jsonify({
                'success': False,
                'error': 'Geçersiz IBAN numarası'
            }), 400
        
        # Aynı IBAN var mı kontrol et
        existing_iban = IBAN.query.filter_by(iban_number=iban_number).first()
        if existing_iban:
            return jsonify({
                'success': False,
                'error': 'Bu IBAN numarası zaten kayıtlı'
            }), 400
        
        # Yeni IBAN kaydı oluştur
        new_iban = IBAN(
            iban_number=iban_number,
            bank_name=data['bank_name'],
            account_holder=data['account_holder'],
            description=data.get('description', '')
        )
        
        db.session.add(new_iban)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': new_iban.to_dict(),
            'message': 'IBAN başarıyla eklendi'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@iban_bp.route('/ibans/<int:iban_id>', methods=['GET'])
def get_iban(iban_id):
    """Belirli bir IBAN kaydını getir"""
    try:
        iban = IBAN.query.get_or_404(iban_id)
        return jsonify({
            'success': True,
            'data': iban.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@iban_bp.route('/ibans/<int:iban_id>', methods=['PUT'])
def update_iban(iban_id):
    """IBAN kaydını güncelle"""
    try:
        iban = IBAN.query.get_or_404(iban_id)
        data = request.get_json()
        
        # IBAN numarası güncelleniyorsa doğrula
        if 'iban_number' in data:
            new_iban_number = data['iban_number'].replace(' ', '').upper()
            if not IBAN.validate_iban(new_iban_number):
                return jsonify({
                    'success': False,
                    'error': 'Geçersiz IBAN numarası'
                }), 400
            
            # Başka bir kayıtta aynı IBAN var mı kontrol et
            existing_iban = IBAN.query.filter(
                IBAN.iban_number == new_iban_number,
                IBAN.id != iban_id
            ).first()
            if existing_iban:
                return jsonify({
                    'success': False,
                    'error': 'Bu IBAN numarası başka bir kayıtta zaten mevcut'
                }), 400
            
            iban.iban_number = new_iban_number
        
        # Diğer alanları güncelle
        if 'bank_name' in data:
            iban.bank_name = data['bank_name']
        if 'account_holder' in data:
            iban.account_holder = data['account_holder']
        if 'description' in data:
            iban.description = data['description']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': iban.to_dict(),
            'message': 'IBAN başarıyla güncellendi'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@iban_bp.route('/ibans/<int:iban_id>', methods=['DELETE'])
def delete_iban(iban_id):
    """IBAN kaydını sil"""
    try:
        iban = IBAN.query.get_or_404(iban_id)
        db.session.delete(iban)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'IBAN başarıyla silindi'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@iban_bp.route('/ibans/validate', methods=['POST'])
def validate_iban():
    """IBAN numarasını doğrula"""
    try:
        data = request.get_json()
        iban_number = data.get('iban_number', '')
        
        if not iban_number:
            return jsonify({
                'success': False,
                'error': 'IBAN numarası gereklidir'
            }), 400
        
        is_valid = IBAN.validate_iban(iban_number)
        formatted_iban = IBAN.format_iban(iban_number) if is_valid else None
        
        return jsonify({
            'success': True,
            'data': {
                'is_valid': is_valid,
                'formatted_iban': formatted_iban
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

