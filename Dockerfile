# Build
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# URL pública para canonical/og:image/sitemap: docker build --build-arg VITE_SITE_URL=https://...
ARG VITE_SITE_URL=
ARG VITE_FORMSPREE_ENDPOINT=
ENV VITE_SITE_URL=$VITE_SITE_URL VITE_FORMSPREE_ENDPOINT=$VITE_FORMSPREE_ENDPOINT
RUN npm run build

# Serve
FROM nginx:1.27-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
