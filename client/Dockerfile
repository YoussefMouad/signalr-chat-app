FROM nginx:alpine

COPY dist/client /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80

# CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]

# --------------------------------------------------------

# FROM node:alpine AS build

# WORKDIR /app
# COPY . .

# RUN npm ci && npm run build

# FROM nginx:alpine
# COPY --from=build /app/dist/client /usr/share/nginx/html
# COPY --from=build /app/dist/client/assets/env.prod.js /usr/share/nginx/html/assets/env.js
# COPY nginx.conf /etc/nginx/conf.d/default.conf 
# EXPOSE 80

# CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
