FROM daocloud.io/library/nginx
MAINTAINER Aaron Chen<mail@aaronchen.cn>

COPY ./dist/ /usr/share/nginx/html/

EXPOSE 80






