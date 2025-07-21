#!/usr/bin/env python3
"""
Railway PORT debug script
Bu script Railway'de PORT değişkeninin nasıl okunduğunu test eder
"""
import os
import sys

print("=== Railway PORT Debug ===")
print(f"Python version: {sys.version}")
print(f"PORT environment variable: '{os.getenv('PORT', 'NOT_SET')}'")
print(f"PORT type: {type(os.getenv('PORT'))}")

# Tüm environment variables'ları listele
print("\n=== All Environment Variables ===")
for key, value in sorted(os.environ.items()):
    print(f"{key}: {value}")

# PORT değişkenini parse etmeye çalış
port_str = os.getenv('PORT', '5000')
print(f"\n=== PORT Parsing Test ===")
print(f"PORT string: '{port_str}'")

try:
    port_int = int(port_str)
    print(f"PORT as integer: {port_int}")
    print("✅ PORT parsing successful")
except ValueError as e:
    print(f"❌ PORT parsing failed: {e}")

# Railway specific checks
print(f"\n=== Railway Environment ===")
print(f"RAILWAY_ENVIRONMENT: {os.getenv('RAILWAY_ENVIRONMENT', 'NOT_SET')}")
print(f"RAILWAY_PROJECT_ID: {os.getenv('RAILWAY_PROJECT_ID', 'NOT_SET')}")
print(f"RAILWAY_SERVICE_ID: {os.getenv('RAILWAY_SERVICE_ID', 'NOT_SET')}")
