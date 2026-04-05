const http = require('http');

// RAM üzerinde tutulan sayaçlar (Adli bilişim dostu: süreç bitince veri silinir)
const requestCounts = {}; 
const LIMIT = 5; // 10 saniyede maksimum 5 istek hakkı
const WINDOW_MS = 10000; // 10 saniyelik pencere

const server = http.createServer((req, res) => {
    const ip = req.socket.remoteAddress;
    const now = Date.now();

    // IP kaydı yoksa oluştur
    if (!requestCounts[ip]) {
        requestCounts[ip] = { count: 1, startTime: now };
    } else {
        // Zaman penceresi içindeyse sayacı artır
        if (now - requestCounts[ip].startTime < WINDOW_MS) {
            requestCounts[ip].count++;
        } else {
            // Zaman penceresi dolduysa sıfırla
            requestCounts[ip].count = 1;
            requestCounts[ip].startTime = now;
        }
    }

    // Güvenlik Analizi: Kullanıcıyı HTTP Header üzerinden bilgilendir
    res.setHeader('X-RateLimit-Limit', LIMIT);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, LIMIT - requestCounts[ip].count));

    // Limit aşımı kontrolü
    if (requestCounts[ip].count > LIMIT) {
        res.writeHead(429, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('HTTP 429: Çok Fazla İstek! (Rate Limit Aşıldı)');
    }

    // Başarılı istek
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('İstek Başarılı! Sunucu güvenle yanıt veriyor.');
});

// Sunucuyu 3000 portunda başlat
server.listen(3000, () => {
    console.log('Rate Limiter Sunucusu 3000 portunda aktif.');
});
