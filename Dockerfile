FROM daocloud.io/node:5.12.0-onbuild
MAINTAINER Aaron Chen<mail@aaronchen.cn>

apt-get install tomcat7

RUN mkdir -p /app
WORKDIR /app
COPY . /app

/usr/share/tomcat6/webapps/ROOT




RUN npm install
RUN npm run build





