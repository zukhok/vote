FROM node:lts
WORKDIR /root
COPY . /root
RUN npm i -g nodemon
RUN npm i
EXPOSE 1024
CMD nodemon ./build/index.js