FROM daocloud.io/node:5.12.0-onbuild
MAINTAINER Aaron Chen<mail@aaronchen.cn>

RUN apt-get install tomcat7

RUN mkdir -p /app
WORKDIR /app
COPY . /app

copy /app/dist/* /usr/share/tomcat6/webapps/ROOT


RUN npm install
RUN npm run build





