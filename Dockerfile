FROM node:19.1.0-alpine as build

WORKDIR /app

COPY package.json /app/package.json
RUN npm install --omit=dev
COPY . /app
RUN npm run build

FROM nginx:1.23.2-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
