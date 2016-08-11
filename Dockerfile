FROM daocloud.io/node:5.12.0-onbuild
MAINTAINER Aaron Chen<mail@aaronchen.cn>


RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:webupd8team/java
RUN apt-get update

# automatically accept oracle license
RUN echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
# and install java 7 oracle jdk
RUN apt-get -y install oracle-java7-installer && apt-get clean
RUN update-alternatives --display java
RUN echo "JAVA_HOME=/usr/lib/jvm/java-7-oracle" >> /etc/environment

RUN dpkg-divert --local --rename --add /sbin/initctl
RUN ln -s /bin/true /sbin/initctl

# install tomcat7
RUN apt-get -y install tomcat7
# change path for tomcat7
RUN echo "JAVA_HOME=/usr/lib/jvm/java-7-oracle" >> /etc/default/tomcat7
# open default tomcat port


RUN mkdir -p /app
WORKDIR /app
COPY . /app

copy /app/dist/* /usr/share/tomcat6/webapps/ROOT


RUN npm install
RUN npm run build

EXPOSE 8080






