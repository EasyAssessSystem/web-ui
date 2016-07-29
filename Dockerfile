FROM ubuntu
MAINTAINER Aaronchen
RUN apt-get update && \
    apt-get install -y build-essential libssl-dev libmysqlclient-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN curl --location https://raw.github.com/creationix/nvm/master/install.sh | sh && \
    /bin/bash -c "echo \"[[ -s \$HOME/.nvm/nvm.sh ]] && . \$HOME/.nvm/nvm.sh\" >> /etc/profile.d/npm.sh" && \
    "[[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh" >> $HOME/.bashrc

ENV PATH $HOME/.nvm/bin:$PATH

RUN nvm install 5.9.0
RUN nvm use 5.9.0
RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build





