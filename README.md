# Bilişim Güvenliği Vize Ödevi: Rate Limiter Mekanizması ve Güvenlik Analizi

Bu proje, "Module 04: What is Rate Limiter?" konusunu temel alarak hazırlanmıştır. Bir web sunucusuna gelen aşırı isteklerin nasıl sınırlandırıldığını ve bu sürecin güvenlik katmanlarını analiz eder.

## 📖 Konu Anlatımı: Rate Limiter Nedir?
Rate Limiter, bir kullanıcının belirli bir süre içinde yapabileceği istek sayısını kısıtlayan bir "güvenlik kapısıdır". Sunucuyu kazaen veya kötü niyetli (DoS/Brute Force) aşırı yüklenmelerden korur. Bu analizde "Fixed Window" (Sabit Pencere) algoritması ele alınmıştır.

---

## 🛠️ Analiz Aşamaları

### Adım 1: Kurulum ve Kaynak Analizi (Reverse Engineering)
Uygulama, Node.js mimarisi üzerinde dışarıdan paket bağımlılığı olmadan çalışmaktadır. Dışarıdan paket indirilmediği için "tedarik zinciri saldırılarına" karşı güvenlidir. Kurulum süreci root yetkisi gerektirmez.

### Adım 2: İzolasyon ve İz Bırakmadan Temizlik (Forensics & Cleanup)
Uygulama verileri disk yerine bellekte (RAM) tutar. Süreç sonlandırıldığı anda tüm IP kayıtları ve sayaçlar silinir. Sistemde herhangi bir log veya dosya kalıntısı bırakmadığı için adli bilişim açısından temiz bir yapıya sahiptir.

### Adım 3: İş Akışları ve CI/CD Pipeline Analizi
GitHub Actions (.github/workflows) entegrasyonu sayesinde kod her güncellendiğinde otomatik testler çalışır. Webhook'lar aracılığıyla sunucunun güvenli durumu sürekli denetlenir.

### Adım 4: Docker Mimarisi ve Konteyner Güvenliği
Uygulama, güvenli bir taban olan `node:alpine` imajı ile izole edilir. Bu sayede uygulama ana makineden (Host) kernel seviyesinde ayrılır ve sadece belirlenen portlar üzerinden erişime izin verilir.

### Adım 5: Kaynak Kod ve Tehdit Modellemesi (Threat Modeling)
Uygulama, HTTP başlıkları (X-RateLimit-Limit, Remaining) üzerinden kullanıcıyı bilgilendirir. 
* **Tehdit:** IP tabanlı kısıtlama, saldırganın IP değiştirmesi durumunda yetersiz kalabilir. 
* **Çözüm:** Daha ileri seviye güvenlik için "Token Bucket" algoritması önerilir.

