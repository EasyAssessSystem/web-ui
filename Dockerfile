FROM ubuntu
MAINTAINER Aaronchen

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.3/install.sh | bash
RUN export NVM_DIR="$HOME/.nvm"

RUN nvm install 5.9.0
RUN nvm use 5.9.0
RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build





