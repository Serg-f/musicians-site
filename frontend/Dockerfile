FROM node:16-alpine as build
WORKDIR /project_dir
COPY ./frontend .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]