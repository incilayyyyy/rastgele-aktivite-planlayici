### Kurulum

1. **Proje Dizinine Git**:
    ```bash
    cd project
    ```

2. **Bağımlılıkları Yükle**:
    ```bash
    npm install
    ```

   3. **Konfigürasyon Dosyasını Oluşturun**: `config/default.json` dosyasını oluşturun ve aşağıdaki temel konfigürasyon bilgilerini ekleyin: 
   (Frontend(NextJs) için Normal api isteklerini gene 3000 portuna istek atın, 1477 portuna istek atmayın, next js üzerinden yönlendirme yapılandırıldı)
    ```json
    {
      "app": {
      "host": "127.0.0.1",
      "port": 1477,
      "key": "qwerty",
      "expires_in": "365d", // Token geçerlilik süresi 365 gün
      "env": "develeopment", // Uygulama ortamı, "production" || "development"
      "redis": {
      "host": "localhost",
      "db": 7,
      "port": 6379,
      "expires_in": 31536000000, // Token geçerlilik süresi 365 gün
      "family": 4
      },
      "rate_limiter": {
      "points": 500, // Kullanıcı başına izin verilen istek sayısı
      "duration": 60, // Dakikada 5 istek
      "blockDuration": 60 // 1 dakika boyunca engelleme
      },
      "logger": {
      "logFile": "logs/%DATE%.log", // Günlük dosya adı
      "datePattern": "YYYY-MM-DD", // Dosya adında tarih formatı
      "zippedArchive": true, // Log dosyalarını sıkıştır
      "maxSize": "20m", // Maksimum log dosyası boyutu
      "maxFiles": "30d" // 30 gün boyunca log dosyalarını sakla
      }
      },
      "db": {
      "type": "postgres",
      "host": "127.0.0.1",
      "port": 5432,
      "name": "",
      "username": "root",
      "password": "root",
      "synchronize": true,
      "logging": false
      }
    }
   ```

4. **Veritabanını Başlatın** (Varsa):
    ```bash
    npm run seed
    ```

5. **API Sunucusunu Başlatın**:
    ```bash
    npm run dev
    ```