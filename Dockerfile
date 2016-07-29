FROM daocloud.io/node:5.12.0-onbuild
MAINTAINER Aaron Chen<mail@aaronchen.cn>


RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build





