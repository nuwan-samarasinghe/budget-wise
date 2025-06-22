# Makefile for Docker Compose Management

# setup service
setup:
	npm install

# Start all services
up:
	docker-compose up --build -d

# Stop all running containers
stop:
	docker-compose down

# Remove all containers and images, but preserve named volumes like pgdata
clean:
	docker-compose down --rmi all --remove-orphans
