import ConfigParser
import docker
import os


class ESDockerDepolier:
    def __init__(self):
        self.aliyun_docker_repo = os.environ['ALIYUN_DOCKER_REPO']
        self.aliyun_docker_username = os.environ['ALIYUN_DOCKER_USER']
        self.aliyun_docker_password = os.environ['ALIYUN_DOCKER_PASSWORD']
        self.destination_docker_base_url = os.environ['DOCKER_BASE_URL']
        self.app_name = os.environ['APP_NAME']
        self.client = docker.DockerClient(base_url=self.destination_docker_base_url)
        self.image_name = self.aliyun_docker_repo + '/' + self.app_name

    def __parseConfig(self):
        config = ConfigParser.ConfigParser()
        config.readfp('')
        config.get()


    def log_in(self):
        self.client.login(username=self.aliyun_docker_username,
                          password=self.aliyun_docker_password,
                          registry=self.aliyun_docker_repo)

    def pull_image(self):
        print '******************Start Pulling the Image*******************\n'
        self.client.images.pull(self.image_name)
        print '****************** Pulling the Image Success****************\n'

    def stop_container(self):
        print '******************Start Stoping the Container **************\n'
        containers = self.client.containers.list(all=True, filters={'name': self.app_name})
        print len(containers).__str__() + " containers need to stopped\n"
        if len(containers) > 0:
            for each_container in containers:
                each_container.stop()
                each_container.remove()

    def start_container(self, cmd=None, **kwargs):
        print '******************Start Starting the Container *************\n'
        self.client.containers.run(self.image_name, cmd, name=self.app_name, detach=True, **kwargs)

    def run(self, cmd=None, **kwargs):
        print '******************Start Logging In*************************\n'
        self.log_in()
        print '****************** Logging In Success**********************\n'
        self.pull_image()
        self.stop_container()
        self.start_container(cmd, **kwargs)
