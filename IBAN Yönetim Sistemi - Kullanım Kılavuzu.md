# IBAN Yönetim Sistemi - Kullanım Kılavuzu

## Genel Bakış

IBAN Yönetim Sistemi, IBAN numaralarınızı güvenli bir şekilde saklamanıza, yönetmenize ve organize etmenize olanak sağlayan modern bir web uygulamasıdır.

## Özellikler

### ✅ Temel Özellikler
- **IBAN Ekleme**: Yeni IBAN numaralarını sisteme kaydetme
- **IBAN Listeleme**: Kayıtlı tüm IBAN'ları görüntüleme
- **IBAN Düzenleme**: Mevcut IBAN bilgilerini güncelleme
- **IBAN Silme**: Artık kullanılmayan IBAN'ları kaldırma
- **IBAN Doğrulama**: Gerçek zamanlı IBAN numarası doğrulama
- **Arama**: IBAN, banka adı veya hesap sahibi ile arama
- **Kopyalama**: IBAN numaralarını tek tıkla panoya kopyalama

### 🔒 Güvenlik Özellikleri
- Yerel SQLite veritabanı kullanımı
- IBAN numarası format doğrulaması
- Mod 97 algoritması ile IBAN doğrulama
- Duplicate IBAN kontrolü

### 📱 Kullanıcı Deneyimi
- Responsive tasarım (mobil uyumlu)
- Modern ve kullanıcı dostu arayüz
- Gerçek zamanlı bildirimler
- Smooth animasyonlar ve geçişler

## Kurulum ve Çalıştırma

### Gereksinimler
- Python 3.11+
- Flask ve bağımlılıkları (requirements.txt'te listelendi)

### Kurulum Adımları

1. **Proje dizinine gidin:**
   ```bash
   cd iban-manager
   ```

2. **Sanal ortamı aktifleştirin:**
   ```bash
   source venv/bin/activate
   ```

3. **Uygulamayı başlatın:**
   ```bash
   python src/main.py
   ```

4. **Tarayıcınızda açın:**
   ```
   http://localhost:5000
   ```

## Kullanım Kılavuzu

### 1. Yeni IBAN Ekleme

1. Ana sayfada "Yeni IBAN Ekle" bölümünü bulun
2. **IBAN Numarası** alanına IBAN'ı girin (otomatik doğrulama yapılır)
3. **Banka Adı** alanını doldurun
4. **Hesap Sahibi** bilgisini girin
5. İsteğe bağlı **Açıklama** ekleyin
6. **Kaydet** butonuna tıklayın

**Not:** IBAN numarası girerken gerçek zamanlı doğrulama yapılır. Geçerli IBAN'lar yeşil ✓ işareti ile gösterilir.

### 2. IBAN Listesini Görüntüleme

- Kayıtlı IBAN'lar "Kayıtlı IBAN'lar" bölümünde kart formatında görüntülenir
- Her kart şu bilgileri içerir:
  - IBAN numarası (formatlanmış)
  - Banka adı
  - Hesap sahibi
  - Eklenme tarihi
  - Açıklama (varsa)

### 3. IBAN Arama

1. "Kayıtlı IBAN'lar" bölümündeki arama kutusunu kullanın
2. Şu kriterlere göre arama yapabilirsiniz:
   - IBAN numarası
   - Banka adı
   - Hesap sahibi adı
   - Açıklama metni

### 4. IBAN Düzenleme

1. Düzenlemek istediğiniz IBAN kartında **Düzenle** (✏️) butonuna tıklayın
2. Açılan modal pencerede bilgileri güncelleyin
3. **Güncelle** butonuna tıklayın

### 5. IBAN Silme

1. Silmek istediğiniz IBAN kartında **Sil** (🗑️) butonuna tıklayın
2. Onay penceresinde IBAN bilgilerini kontrol edin
3. **Sil** butonuna tıklayarak onaylayın

### 6. IBAN Kopyalama

- Herhangi bir IBAN kartında **Kopyala** (📋) butonuna tıklayın
- IBAN numarası otomatik olarak panoya kopyalanır
- Başarılı kopyalama bildirimi görüntülenir

## Teknik Detaylar

### Veritabanı
- **Tür**: SQLite
- **Konum**: `src/database/app.db`
- **Tablolar**: 
  - `iban`: IBAN kayıtları
  - `user`: Kullanıcı bilgileri (gelecek sürümler için)

### API Endpoints

#### IBAN İşlemleri
- `GET /api/ibans` - Tüm IBAN'ları listele
- `POST /api/ibans` - Yeni IBAN ekle
- `GET /api/ibans/{id}` - Belirli IBAN'ı getir
- `PUT /api/ibans/{id}` - IBAN'ı güncelle
- `DELETE /api/ibans/{id}` - IBAN'ı sil
- `POST /api/ibans/validate` - IBAN doğrula

### IBAN Doğrulama Algoritması

Uygulama, uluslararası standart Mod 97 algoritmasını kullanarak IBAN doğrulaması yapar:

1. IBAN'ın uzunluk kontrolü (15-34 karakter)
2. Ülke kodu kontrolü (ilk 2 karakter harf)
3. Kontrol haneleri kontrolü (3-4. karakterler rakam)
4. Mod 97 matematiksel doğrulama

### Güvenlik

- **Yerel Depolama**: Veriler yerel SQLite veritabanında saklanır
- **Input Validation**: Tüm girişler doğrulanır
- **XSS Koruması**: Frontend'de güvenli DOM manipülasyonu
- **CORS**: Cross-origin isteklere izin verilir

## Sorun Giderme

### Yaygın Sorunlar

**1. "Geçersiz IBAN numarası" hatası**
- IBAN formatını kontrol edin
- Boşlukları ve özel karakterleri kaldırın
- Türkiye IBAN'ları TR ile başlamalıdır

**2. "Bu IBAN numarası zaten kayıtlı" hatası**
- Aynı IBAN birden fazla kez eklenemez
- Mevcut kaydı düzenleyin veya silin

**3. Uygulama açılmıyor**
- Python ve Flask'ın doğru kurulduğundan emin olun
- Port 5000'in başka bir uygulama tarafından kullanılmadığını kontrol edin
- Sanal ortamın aktif olduğundan emin olun

### Log Dosyaları

Flask development server logları terminal/konsol çıktısında görüntülenir. Hata ayıklama için bu logları kontrol edin.

## Gelecek Sürümler

### Planlanan Özellikler
- Kullanıcı hesapları ve kimlik doğrulama
- IBAN kategorileri ve etiketleme
- Excel/CSV export/import
- Yedekleme ve geri yükleme
- Çoklu dil desteği
- Banka logoları ve detaylı bilgiler

## Destek

Herhangi bir sorun yaşarsanız veya öneriniz varsa:
- Uygulama loglarını kontrol edin
- IBAN formatının doğru olduğundan emin olun
- Tarayıcı konsolunu kontrol edin (F12)

## Lisans

Bu uygulama eğitim ve kişisel kullanım amaçlıdır.

