DOCKER_CMD = DOCKER_BUILDKIT=1 docker-compose -p dragonzo -f ./packages/devops/docker-compose.yml

start:
	$(DOCKER_CMD) up --build