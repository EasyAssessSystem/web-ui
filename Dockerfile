FROM jolicode/base
MAINTAINER Aaron Chen<mail@aaronchen.cn>



RUN sudo echo 'deb http://cn.archive.ubuntu.com/ubuntu/' >> /etc/apt/sources.list

RUN sudo apt-get update && \
    sudo apt-get install -y build-essential libssl-dev libmysqlclient-dev && \
    sudo apt-get clean && \
    sudo rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN curl --location https://raw.github.com/creationix/nvm/master/install.sh | sh && \
    sudo /bin/bash -c "echo \"[[ -s \$HOME/.nvm/nvm.sh ]] && . \$HOME/.nvm/nvm.sh\" >> /etc/profile.d/npm.sh" && \
    echo "[[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh" >> $HOME/.bashrc

ENV PATH $HOME/.nvm/bin:$PATH
RUN nvm install 5.9.0
RUN nvm use 5.9.0
RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build





