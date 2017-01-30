FROM daocloud.io/library/nginx
MAINTAINER Aaron Chen<mail@aaronchen.cn>

COPY ./dist/ /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/
EXPOSE 80






