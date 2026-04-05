# Güvenlik için en hafif ve güncel taban imajı
FROM node:20-alpine

# Güvenlik: Uygulamayı root yetkisi olmayan bir kullanıcıyla çalıştır
USER node

# Çalışma dizinini ayarla
WORKDIR /home/node/app

# Sadece gerekli olan sunucu dosyasını kopyala
COPY --chown=node:node server.js .

# Uygulamanın çalışacağı portu belirle
EXPOSE 3000

# Uygulamayı başlat
CMD ["node", "server.js"]
