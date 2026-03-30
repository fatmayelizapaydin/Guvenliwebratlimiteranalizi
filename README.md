# Bilişim Güvenliği Vize Projesi: Rate Limiter (Hız Sınırlayıcı) Analizi

Bu çalışma, web uygulama güvenliğinde hizmet sürekliliğini sağlamak ve kötü niyetli istekleri engellemek için kullanılan **Rate Limiting** mekanizmasını, ders müfredatındaki (Module 04) prensiplere göre analiz eder.

---

## 📖 Konu Anlatımı: Rate Limiter Nedir?
Rate Limiter, bir istemcinin (IP veya Kullanıcı) belirli bir zaman dilimi içerisinde sunucuya yapabileceği maksimum istek sayısını kontrol eden bir güvenlik katmanıdır. 
* **Amacı:** Kaba kuvvet (Brute Force) saldırılarını yavaşlatmak ve sunucunun kaynaklarını tüketmeye yönelik DoS saldırılarını engellemektir.
* **Seçilen Algoritma:** **Fixed Window (Sabit Pencere)**. Bu yöntemde zaman, sabit bloklara bölünür (Örneğin her 30 saniye) ve bu blok içindeki istekler sayılır.

---

## 🛠️ Ödev Analiz Aşamaları

### 1. Kurulum ve Kaynak Analizi (Reverse Engineering)
Analiz edilen yapı, herhangi bir üçüncü taraf kütüphane bağımlılığı olmadan standart Node.js kütüphaneleriyle kurgulanmıştır.
* **Güvenlik Kontrolü:** Yazılım, kurulum sırasında dışarıdan kontrolsüz paket çekmez (`npm install` gerektirmez). Bu, tedarik zinciri saldırılarına (Supply Chain Attacks) karşı koruma sağlar.
* **Yetkilendirme:** Uygulama root yetkisi gerektirmeyen yüksek portlarda (3000) çalışacak şekilde izole edilmiştir.

### 2. İzolasyon ve İz Bırakmadan Temizlik (Forensics & Cleanup)
Sistem kaynaklarının temiz kullanımı ve güvenlik analizi (forensics) açısından uygulama şu özelliklere sahiptir:
* **Bellek Yönetimi:** İstek sayıları kalıcı bir veritabanı yerine geçici bellekte (In-memory) tutulur.
* **Cleanup:** Uygulama süreci sonlandırıldığında, bellekteki tüm kullanıcı takip verileri ve IP kayıtları silinir. Sistemde kalıcı hiçbir log veya dosya kalıntısı bırakmaz.

### 3. İş Akışları ve CI/CD Pipeline Analizi
Projenin GitHub üzerindeki yaşam döngüsü otomatize edilmiştir:
* **Pipeline Analizi:** GitHub Actions kullanılarak yapılan her kod değişikliğinde sistemin bütünlüğü test edilir.
* **Webhook Rolü:** Kodda bir değişiklik algılandığında Webhook üzerinden tetiklenen süreç, güvenlik testlerini otomatik olarak başlatır.

### 4. Docker Mimarisi ve Konteyner Güvenliği
Uygulamanın Dockerize edilmesi, sistem izolasyonu için kritik bir adımdır:
* **Konteyner Güvenliği:** Uygulama `node:alpine` imajı kullanılarak en küçük saldırı yüzeyine sahip olacak şekilde kurgulanmıştır.
* **İzolasyon:** Konteyner, ana makine (host) işletim sisteminden kernel bazlı izole edilerek sunucu güvenliğini artırır.

### 5. Kaynak Kod ve Tehdit Modellemesi (Threat Modeling)
Uygulamanın ana giriş noktası (entrypoint) `app.js` dosyasıdır.
* **Analiz:** Uygulama, her istekte HTTP başlıklarına (X-RateLimit-Limit, Remaining) bilgi ekleyerek şeffaf bir güvenlik sağlar.
* **Tehdit Senaryosu:** IP bazlı kısıtlama yapıldığı için saldırganlar "Distributed" (dağıtık) saldırılarla bu mekanizmayı aşmaya çalışabilir. Buna karşı gerçek senaryolarda "Token Bucket" gibi daha dinamik algoritmalar önerilir.

---
