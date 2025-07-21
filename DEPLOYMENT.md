# IBAN Manager - Mobil Uygulama ve Backend Deployment

## 📱 Gerçek Mobil Uygulama Seçenekleri

### 1. **React Native (Önerilen)**
```bash
# React Native CLI kurulumu
npm install -g @react-native-community/cli
npx react-native init IBANManager
```

### 2. **Flutter (Cross-platform)**
```bash
# Flutter kurulumu
# flutter.dev adresinden indirin
flutter create iban_manager
```

### 3. **Capacitor + Ionic (Mevcut Web Kodunu Kullanarak)**
```bash
npm install -g @ionic/cli
ionic start iban-manager tabs --type=angular
# Mevcut HTML/CSS/JS kodlarınızı entegre edin
```

### 4. **Xamarin (Microsoft)**
- Visual Studio ile C# kullanarak
- iOS ve Android için tek kod

## 🚀 Backend Hosting Seçenekleri

### 1. **Railway (Kolay ve Ücretsiz Başlangıç)**

1. **Railway hesabı oluşturun:** railway.app
2. **GitHub'a backend kodunuzu yükleyin**
3. **Railway'de "Deploy from GitHub" seçin**
4. **PostgreSQL database ekleyin**

**Dockerfile oluşturun:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["python", "src/main.py"]
```

### 2. **Render (Ücretsiz Tier)**

1. **render.com'a gidin**
2. **GitHub repository bağlayın**
3. **Web Service olarak deploy edin**
4. **PostgreSQL database ekleyin**

### 3. **Heroku Alternatifi - Fly.io**

```bash
# Fly CLI kurulumu
# fly.io/docs/hands-on/install-flyctl/
flyctl auth signup
flyctl launch
flyctl deploy
```

### 4. **DigitalOcean App Platform**

1. **DigitalOcean hesabı oluşturun**
2. **App Platform'u seçin**
3. **GitHub repository bağlayın**
4. **Managed Database ekleyin**

## 💾 Database Hosting

### 1. **PlanetScale (MySQL)**
- Ücretsiz 5GB
- Serverless MySQL
- Global read replicas

### 2. **Supabase (PostgreSQL)**
- Ücretsiz 500MB
- Real-time subscriptions
- Built-in auth

### 3. **MongoDB Atlas**
- Ücretsiz 512MB
- Global clusters
- Full-text search

### 4. **Neon (PostgreSQL)**
- Ücretsiz 3GB
- Branching database
- Serverless

## 🔧 Backend Güncellemeleri

## 🔧 Backend Güncellemeleri

### SQLite'den PostgreSQL'e Geçiş

**requirements.txt'e ekleyin:**
```
psycopg2-binary==2.9.9
python-dotenv==1.0.0
```

**Environment variables için .env dosyası:**
```env
DATABASE_URL=postgresql://username:password@host:port/database
SECRET_KEY=your-secret-key-here
FLASK_ENV=production
```

### Docker Deployment

**Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "src.main:app"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/iban_db
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: iban_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 📱 React Native Uygulaması

### Kurulum ve Başlangıç

```bash
# React Native CLI kurulumu
npm install -g @react-native-community/cli

# Proje oluşturma
npx react-native init IBANManager
cd IBANManager

# Gerekli paketler
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install axios react-native-async-storage
```

### Ana Ekran Component'i

**src/screens/HomeScreen.js:**
```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';

const API_BASE = 'https://your-backend-url.com/api';

const HomeScreen = () => {
  const [ibans, setIbans] = useState([]);
  
  useEffect(() => {
    loadIbans();
  }, []);
  
  const loadIbans = async () => {
    try {
      const response = await axios.get(`${API_BASE}/ibans`);
      setIbans(response.data.data);
    } catch (error) {
      Alert.alert('Hata', 'IBAN listesi yüklenemedi');
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>IBAN Manager</Text>
      <FlatList
        data={ibans}
        renderItem={({ item }) => (
          <View style={styles.ibanCard}>
            <Text style={styles.iban}>{item.iban_number}</Text>
            <Text style={styles.bank}>{item.bank_name}</Text>
            <Text style={styles.holder}>{item.account_holder}</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  ibanCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iban: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  bank: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  holder: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
});

export default HomeScreen;
```

## ⚡ Railway'de Adım Adım Deployment

### 1. GitHub'a Proje Yükleme

```bash
# Git repo başlat
git init
git add .
git commit -m "Initial commit - IBAN Manager"

# GitHub'a push et
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/iban-manager.git
git push -u origin main
```

### 2. Railway'de Deployment

1. **railway.app** adresine gidin
2. **"Start a New Project"** tıklayın
3. **"Deploy from GitHub repo"** seçin
4. **Repository'nizi seçin**
5. **"Deploy Now"** tıklayın

### 3. PostgreSQL Database Ekleme

1. Railway dashboard'da **"+ New"** tıklayın
2. **"Database" → "PostgreSQL"** seçin
3. Database otomatik oluşacak
4. `DATABASE_URL` environment variable otomatik ayarlanacak

### 4. Environment Variables Ayarlama

Railway dashboard'da **"Variables"** sekmesinde şunları ekleyin:

```env
SECRET_KEY=your-very-secure-random-secret-key-here-12345
FLASK_ENV=production
```

**SECRET_KEY** için güçlü bir anahtar oluşturun:
```python
import secrets
print(secrets.token_urlsafe(32))
```

### 5. Domain Ayarlama (Opsiyonel)

1. **"Settings"** sekmesinde
2. **"Domains"** bölümünde
3. **"Custom Domain"** ekleyebilirsiniz

### 6. Deployment Kontrolü

- **"Deployments"** sekmesinde build loglarını kontrol edin
- **"Logs"** sekmesinde runtime loglarını görün
- Verilen URL'de uygulamanızı test edin

## 🔧 Railway Dosyaları (Hazır)

Projenizde şu dosyalar Railway deployment için hazırlandı:

- ✅ `Procfile` - Railway start komutu
- ✅ `railway.json` - Railway konfigürasyonu  
- ✅ `runtime.txt` - Python versiyon belirteci
- ✅ `requirements-production.txt` - Production dependencies
- ✅ `.gitignore` - Git ignore dosyası
- ✅ `Dockerfile` - Container konfigürasyonu
- ✅ Güncellenmiş `main.py` - Health check + PORT desteği

## 🚀 Hızlı Başlangıç (5 Dakika)

1. **GitHub repo oluşturun ve push edin**
2. **Railway'e gidin ve GitHub repo'yu bağlayın**
3. **PostgreSQL ekleyin**
4. **SECRET_KEY environment variable ekleyin**
5. **Deploy edin ve test edin!**

**URL örneği:** `https://iban-manager-production.railway.app`
