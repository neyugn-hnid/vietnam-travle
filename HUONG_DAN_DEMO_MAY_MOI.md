# Huong dan setup demo tren may moi

Tai lieu nay dung khi copy/clone source `vietnam-travle` sang mot may Windows moi de chay demo 1 ngay bang XAMPP Apache, MySQL, Node.js va Cloudflare Tunnel.

## 1. Cai phan mem can thiet

Cai tren may moi:

- Node.js 18 tro len
- XAMPP
- Git, neu lay source tu GitHub

Mo XAMPP Control Panel va bat:

```text
Apache
MySQL
```

## 2. Dat source code

Nen dat source o duong dan ngan, it dau tieng Viet, vi du:

```text
C:\vietnam-travle
```

Neu dat o duong dan khac, cac lenh ben duoi can thay `C:\vietnam-travle` bang duong dan moi.

## 3. Tao database

Mo phpMyAdmin:

```text
http://localhost/phpmyadmin
```

Tao database:

```sql
CREATE DATABASE webquangbadulich CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 4. Cai va chay backend

Mo PowerShell:

```powershell
cd "C:\vietnam-travle\backend"
npm install
```

Kiem tra file:

```text
C:\vietnam-travle\backend\.env
```

Neu MySQL XAMPP khong co mat khau, dung cau hinh:

```env
DATABASE_URL="mysql://root@localhost:3306/webquangbadulich"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost"
SITE_URL="http://localhost"
```

Tao Prisma client, day schema vao database va seed du lieu:

```powershell
npx prisma generate
npx prisma db push
npm run db:seed
```

Chay backend:

```powershell
npm start
```

Giu cua so PowerShell nay mo trong luc demo.

Kiem tra backend:

```text
http://localhost:3000/api/health
```

Neu hien `status: ok` la backend da chay.

## 5. Cai va build frontend

Mo PowerShell moi:

```powershell
cd "C:\vietnam-travle\frontend"
npm install
npm run build
```

Sau khi build, output nam o:

```text
C:\vietnam-travle\frontend\dist\webquangbadulich\browser
```

## 6. Copy frontend sang Apache

Tao thu muc web cho Apache:

```powershell
New-Item -ItemType Directory -Force -Path "C:\xampp\htdocs\vietnam-travel"
```

Copy ban build:

```powershell
Get-ChildItem -Force -LiteralPath "C:\vietnam-travle\frontend\dist\webquangbadulich\browser" | Copy-Item -Destination "C:\xampp\htdocs\vietnam-travel" -Recurse -Force
```

Tao file `.htaccess` trong:

```text
C:\xampp\htdocs\vietnam-travel\.htaccess
```

Noi dung:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 7. Cau hinh Apache

Mo file:

```text
C:\xampp\apache\conf\httpd.conf
```

Dam bao cac dong sau khong co dau `#` o dau:

```apache
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule headers_module modules/mod_headers.so
Include conf/extra/httpd-vhosts.conf
```

Mo file:

```text
C:\xampp\apache\conf\extra\httpd-vhosts.conf
```

Them cau hinh:

```apache
<VirtualHost *:80>
    ServerName localhost

    DocumentRoot "C:/xampp/htdocs/vietnam-travel"

    <Directory "C:/xampp/htdocs/vietnam-travel">
        Options FollowSymLinks
        AllowOverride All
        Require all granted

        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    ProxyPreserveHost On

    ProxyPass /api http://localhost:3000/api
    ProxyPassReverse /api http://localhost:3000/api

    ProxyPass /uploads http://localhost:3000/uploads
    ProxyPassReverse /uploads http://localhost:3000/uploads
</VirtualHost>
```

Restart Apache trong XAMPP.

Kiem tra web local:

```text
http://localhost
```

Kiem tra API qua Apache:

```text
http://localhost/api/health
```

## 8. Public link de demo

Tai Cloudflare Tunnel:

```powershell
cd "C:\vietnam-travle"
New-Item -ItemType Directory -Force -Path ".\tools"
Invoke-WebRequest -UseBasicParsing -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile ".\tools\cloudflared.exe"
```

Chay tunnel:

```powershell
.\tools\cloudflared.exe tunnel --url http://localhost
```

Cloudflare se in ra link dang:

```text
https://xxxxx.trycloudflare.com
```

Gui link nay cho nguoi khac xem demo.

## 9. Checklist moi lan demo

Moi lan mo may de demo, can bat du:

```text
XAMPP MySQL
XAMPP Apache
Backend: npm start trong C:\vietnam-travle\backend
Cloudflare Tunnel: .\tools\cloudflared.exe tunnel --url http://localhost
```

Khong can build lai neu khong sua code frontend.

Chi build lai khi co sua Angular:

```powershell
cd "C:\vietnam-travle\frontend"
npm run build
Get-ChildItem -Force -LiteralPath "C:\vietnam-travle\frontend\dist\webquangbadulich\browser" | Copy-Item -Destination "C:\xampp\htdocs\vietnam-travel" -Recurse -Force
```

## 10. Loi thuong gap

Neu `http://localhost/api/health` khong chay:

- Kiem tra backend da `npm start` chua.
- Kiem tra backend co dang dung port `3000` khong.
- Kiem tra Apache da bat `mod_proxy_http` chua.

Neu frontend hien nhung login/admin khong goi duoc API:

- Kiem tra `ProxyPass /api http://localhost:3000/api`.
- Kiem tra backend con dang chay.

Neu refresh trang `/admin` bi 404:

- Kiem tra `.htaccess`.
- Kiem tra `mod_rewrite` da bat.
- Kiem tra `AllowOverride All`.

Neu link Cloudflare khong vao duoc:

- Tat lenh tunnel cu va chay lai.
- Lay link moi dang `https://xxxxx.trycloudflare.com`.
- Dam bao Apache, backend va MySQL van dang bat.

## 11. Neu da co domain

Co 2 cach dung domain:

- Cach nhanh cho demo 1 ngay: tro domain ve Cloudflare Tunnel.
- Cach on dinh lau dai: tro domain ve VPS hoac IP public cua server.

Voi demo 1 ngay, nen dung Cloudflare Tunnel vi khong can mo port modem/router va khong can VPS.

### Cach A: Dung domain voi Cloudflare Tunnel

Dieu kien:

- Domain da dua DNS ve Cloudflare.
- May demo dang bat Apache, MySQL va backend Node.
- Da co `cloudflared.exe`.

Dang nhap Cloudflare Tunnel:

```powershell
cd "C:\vietnam-travle"
.\tools\cloudflared.exe tunnel login
```

Lenh nay se mo trinh duyet. Chon domain cua ban tren Cloudflare de xac thuc.

Tao tunnel co ten:

```powershell
.\tools\cloudflared.exe tunnel create vietnam-travel-demo
```

Tao file config:

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.cloudflared"
notepad "$env:USERPROFILE\.cloudflared\config.yml"
```

Noi dung file `config.yml`, thay `ten-domain-cua-ban.com` bang domain that:

```yaml
tunnel: vietnam-travel-demo
credentials-file: C:\Users\YOUR_WINDOWS_USER\.cloudflared\YOUR_TUNNEL_ID.json

ingress:
  - hostname: ten-domain-cua-ban.com
    service: http://localhost
  - hostname: www.ten-domain-cua-ban.com
    service: http://localhost
  - service: http_status:404
```

Luu y:

- `YOUR_WINDOWS_USER` la ten user Windows cua may moi.
- `YOUR_TUNNEL_ID.json` la file credentials Cloudflare tao ra sau lenh `tunnel create`.
- File credentials thuong nam trong `%USERPROFILE%\.cloudflared`.

Tro domain vao tunnel:

```powershell
.\tools\cloudflared.exe tunnel route dns vietnam-travel-demo ten-domain-cua-ban.com
.\tools\cloudflared.exe tunnel route dns vietnam-travel-demo www.ten-domain-cua-ban.com
```

Chay tunnel:

```powershell
.\tools\cloudflared.exe tunnel run vietnam-travel-demo
```

Sau do mo:

```text
https://ten-domain-cua-ban.com
```

Khi demo, phai giu lenh tunnel dang chay.

### Cach B: Tro domain ve IP public hoac VPS

Cach nay dung khi co VPS hoac server co IP public on dinh.

Tao DNS record:

```text
A     @      IP_PUBLIC
CNAME www    ten-domain-cua-ban.com
```

Tren server, Apache van dung cau hinh:

```apache
ProxyPass /api http://localhost:3000/api
ProxyPassReverse /api http://localhost:3000/api

ProxyPass /uploads http://localhost:3000/uploads
ProxyPassReverse /uploads http://localhost:3000/uploads
```

Neu dung may ca nhan o nha, can them:

- Mo port `80` va `443` tren Windows Firewall.
- Port forwarding tren modem/router ve IP noi bo cua may.
- Mang khong bi CGNAT.

Neu bi CGNAT, cach nay se khong chay duoc. Khi do dung Cloudflare Tunnel.

### Sua backend khi dung domain

Trong file:

```text
C:\vietnam-travle\backend\.env
```

Nen sua:

```env
FRONTEND_URL="https://ten-domain-cua-ban.com"
SITE_URL="https://ten-domain-cua-ban.com"
```

Sau khi sua `.env`, tat backend va chay lai:

```powershell
cd "C:\vietnam-travle\backend"
npm start
```

### Kiem tra domain

Kiem tra frontend:

```text
https://ten-domain-cua-ban.com
```

Kiem tra API:

```text
https://ten-domain-cua-ban.com/api/health
```

Neu API tra `status: ok` la domain da tro dung.
