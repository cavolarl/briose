# Build stage
FROM node:lts-alpine AS build

# Install chromium for testing
RUN apk add --no-cache chromium nss

WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY . .

# Set environment variable for Karma to find Chrome
ENV CHROME_BIN=/usr/bin/chromium-browser

# Run tests (optional - remove if you want to run tests separately)
RUN npm test -- --watch=false --browsers=ChromeHeadlessNoSandbox

# Build the Angular app
RUN npm run build -- --output-path=dist

# Production stage (NGINX)
FROM nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
