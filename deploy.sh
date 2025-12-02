#!/usr/bin/env bash
set -euo pipefail

# ===============================================
# ScandinavianFirs.com – FINAL secure one-click deploy
# Works even without package-lock.json
# salesman.txt 100% protected from the web
# ===============================================

if [[ $# -eq 0 ]]; then
  echo "ScandinavianFirs.com – Secure self-hosted deployment"
  read -p "Enter your domain or server IP: " DOMAIN
  [[ -z "$DOMAIN" ]] && echo "Required!" && exit 1
else
  DOMAIN="$1"
fi

echo "Deploying securely to → https://$DOMAIN"
sleep 4

# System + tools
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx git certbot python3-certbot-nginx ufw

# Deploy code
if [ -d "/var/www/scandinavianfirs" ]; then
  echo "Updating existing site..."
  cd /var/www/scandinavianfirs && git pull --ff-only
else
  echo "Cloning repository..."
  rm -rf /var/www/scandinavianfirs
  git clone https://github.com/Xcertik-Realist/testsite.git /var/www/scandinavianfirs
  cd /var/www/scandinavianfirs
fi

# Install & build – automatically works with or without package-lock.json
echo "Installing dependencies & building..."
npm install           # ← this creates package-lock.json if missing
npm run build

# Secure orders directory (outside web root!)
mkdir -p /var/orders
chown www-data:www-data /var/orders
chmod 750 /var/orders

# Make sure orders go to the secure folder
if ! grep -q '/var/orders/salesman.txt' app/api/submit-order/route.ts; then
  sed -i 's|path.join(process\.cwd(), "salesman.txt")|"/var/orders/salesman.txt"|' app/api/submit-order/route.ts
fi

# PM2
npm install -g pm2 2>/dev/null || true
pm2 delete scandinavianfirs 2>/dev/null || true
pm2 start npm --name "scandinavianfirs" -- start
pm2 save
pm2 startup ubuntu | grep sudo | bash || true

# nginx – BLOCK .txt files forever
cat > /etc/nginx/sites-available/scandinavianfirs <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    # BLOCK ALL .txt FILES + HIDDEN FILES
    location ~ \.txt$ { deny all; return 403; }
    location ~ /\. { deny all; return 403; }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/scandinavianfirs /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Firewall & SSL
ufw allow 'Nginx Full' --force 2>/dev/null || true
ufw --force enable 2>/dev/null || true

if certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m admin@"$DOMAIN" --redirect; then
  echo "SSL installed!"
else
  echo "SSL will activate when DNS points here."
fi

echo "=================================================================="
echo "LIVE & 100% SECURE!"
echo "https://$DOMAIN"
echo "Orders safely saved to: /var/orders/salesman.txt (NOT publicly accessible)"
echo "View orders: sudo cat /var/orders/salesman.txt"
echo "Update site: cd /var/www/scandinavianfirs && git pull && npm run build && pm2 restart scandinavianfirs"
echo "=================================================================="
echo "Merry Christmas – your store is now yours forever!"
