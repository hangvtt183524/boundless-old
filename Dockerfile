


FROM nginx:alpine as production

COPY /deployment/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY dist/dashboard .
