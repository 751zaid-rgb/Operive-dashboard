# Use a lightweight Nginx image to serve static content
FROM nginx:alpine

# Copy your static website files into the Nginx public directory
COPY . /usr/share/nginx/html

# Expose port 8080 (Cloud Run's default port)
EXPOSE 8080

# Configure Nginx to listen on port 8080 instead of the default 80
RUN sed -i 's/listen\. \+80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
