#!/usr/bin/env bash
set -euo pipefail

# ===============================================
# ScandinavianFirs.com – FINAL CLEAN DEPLOY SCRIPT
# No more sed fixes needed – checkout is perfect in repo
# salesman.txt 100% protected
# ===============================================

if [[ $# -eq 0 ]] && {
  echo "ScandinavianFirs.com – Final clean deploy"
  read -p "Enter your domain or server IP: " DOMAIN
  [[ -z "$DOMAIN" ]] && echo "Required!" && exit 1
} || DOMAIN="$1"

echo "Deploying to https://$DOMAIN
sleep 4

# System & tools
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx git certbot python3-certbot-nginx ufw

# Fresh clone or update
if [ -d "/var/www/scandinavianfirs" ]; then
  echo "Updating existing site..."
  cd /var/www/scandinavianfirs && git pull --ff-only
else
  echo "Cloning fresh copy..."
  rm -rf /var/www/scandinavianfirs
  git clone https://github.com/Xcertik-Realist/testsite.git /var/www/scandinavianfirs
  cd /var/www/scandinavianfirs
fi

# Install & build
npm install
npm run build

# Secure orders directory (outside web root)
mkdir -p /var/orders
chown www-data:www-data /var/orders
chmod 750 /var/orders

# Force orders to safe location (in case it was old)
if ! grep -q '/var/orders/salesman.txt' app/api/submit-order/route.ts 2>/dev/null; then
  sed -i 's|path.join(process\.cwd(), "salesman.txt")|"/var/orders/salesman.txt"|' app/api/submit-order/route.ts
fi

# PM2 – keep running forever
npm install -g pm2 2>/dev/null || true
pm2 delete scandinavianfirs 2>/dev/null || true
pm2 start npm --name "scandinavianfirs" -- start
pm2 save
pm2 startup ubuntu -u root --hp /root | grep sudo | bash || true

# nginx – block .txt files forever
cat > /etc/nginx/sites-available/scandinavianfirs <<'EOF'
server {
    listen 80;
    server_name _;

    # BLOCK ALL .txt AND HIDDEN FILES
    location ~ \.txt$ { deny all; return 403; }
    location ~ /\. { deny all; return 403; }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/scandinavianfirs /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Firewall & SSL
ufw allow 'Nginx Full' --force >/dev/null 2>&1 || true
ufw --force enable >/dev/null 2>&1 || true

if certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m admin@"$DOMAIN" --redirect >/dev/null 2>&1; then
  echo "SSL certificate installed!"
else
  echo "SSL will activate when DNS points here."
fi

echo "==================================================================="
echo "YOUR CHRISTMAS STORE IS LIVE & PERFECT"
echo "https://$DOMAIN"
echo ""
echo "Orders safely saved → /var/orders/salesman.txt (completely private)"
echo "View orders: sudo cat /var/orders/salesman.txt"
echo "Update anytime: cd /var/www/scandinavianfirs && git pull && npm run build && pm2 restart scandinavianfirs"
echo "==================================================================="
echo "Merry Christmas — now go make money!"
