# Use a lightweight Nginx image
FROM nginx:alpine

# Copy your static website files into the Nginx public directory
COPY . /usr/share/nginx/html

# Cloud Run injects the $PORT environment variable automatically.
# This startup command swaps the default port 80 for Cloud Run's $PORT before starting Nginx.
CMD sed -i -e 's/80/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
