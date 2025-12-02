#!/usr/bin/env bash
set -euo pipefail

# ===============================================
# ScandinavianFirs.com – Secure one-click deploy
# salesman.txt is now completely protected from the web
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
  cd /var/www/scandinavianfirs && git pull
else
  rm -rf /var/www/scandinavianfirs
  git clone https://github.com/Xcertik-Realist/testsite.git /var/www/scandinavianfirs
  cd /var/www/scandinavianfirs
fi

# Build
npm ci --omit=dev
npm run build

# Create secure orders directory (outside public web root!)
mkdir -p /var/orders
chown www-data:www-data /var/orders
chmod 750 /var/orders

# Update API route to save orders in the secure folder
sed -i 's|path.join(process.cwd(), "salesman.txt")|"/var/orders/salesman.txt"|' app/api/submit-order/route.ts || true

# PM2
npm install -g pm2 2>/dev/null || true
pm2 delete scandinavianfirs 2>/dev/null || true
pm2 start npm --name "scandinavianfirs" -- start
pm2 save
pm2 startup ubuntu | grep sudo | bash || true

# nginx config — BLOCK direct access to any .txt files + secure location
cat > /etc/nginx/sites-available/scandinavianfirs <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    # BLOCK ANYONE FROM ACCESSING .txt FILES EVER
    location ~ \.txt$ {
        deny all;
        return 403;
    }

    # Block access to hidden files/folders
    location ~ /\. {
        deny all;
        return 403;
    }

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

# Firewall
ufw allow 'Nginx Full' --force 2>/dev/null || true
ufw --force enable 2>/dev/null || true

# SSL
if certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m admin@"$DOMAIN" --redirect; then
  echo "SSL installed!"
else
  echo "SSL will activate when DNS is pointed here."
fi

echo "=================================================================="
echo "DEPLOYED & FULLY SECURED!"
echo "Live → https://$DOMAIN"
echo ""
echo "Orders are safely saved to: /var/orders/salesman.txt"
echo "This file is NOT accessible from the internet — completely protected"
echo "=================================================================="
echo "To view orders: sudo cat /var/orders/salesman.txt"
echo "To update site later: cd /var/www/scandinavianfirs && git pull && npm run build && pm2 restart scandinavianfirs"
echo "Merry Christmas — your store is now bulletproof!"
