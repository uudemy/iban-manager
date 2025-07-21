#!/usr/bin/env python3
"""
Railway PORT handler and application starter
Güvenilir PORT variable handling için Python kullanıyoruz
"""
import os
import subprocess
import sys

def get_port():
    """PORT değişkenini güvenli şekilde al"""
    port = os.getenv('PORT')
    if port is None:
        print("PORT environment variable not set, using default 5000")
        return 5000
    
    try:
        port_int = int(port)
        print(f"Using PORT: {port_int}")
        return port_int
    except ValueError:
        print(f"Invalid PORT value: '{port}', using default 5000")
        return 5000

def main():
    print("=== Railway IBAN Manager Starter ===")
    
    # Environment bilgilerini göster
    print(f"Python version: {sys.version}")
    print(f"PORT env var: {os.getenv('PORT', 'NOT_SET')}")
    print(f"RAILWAY_ENVIRONMENT: {os.getenv('RAILWAY_ENVIRONMENT', 'NOT_SET')}")
    
    # PORT'u al
    port = get_port()
    
    # Gunicorn komutunu oluştur
    cmd = [
        'gunicorn',
        f'--bind=0.0.0.0:{port}',
        'src.main:app',
        '--workers=4',
        '--timeout=120',
        '--access-logfile=-',
        '--error-logfile=-',
        '--log-level=info'
    ]
    
    print(f"Starting command: {' '.join(cmd)}")
    
    # Gunicorn'u başlat
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error starting gunicorn: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("Shutting down...")
        sys.exit(0)

if __name__ == '__main__':
    main()
