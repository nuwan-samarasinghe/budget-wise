# Makefile for Docker Compose Management

watch-install:
	@command -v watchexec >/dev/null 2>&1 || { \
			echo "Installing watchexec..."; \
			brew install watchexec; \
		}

pre-commit:
	npm install

# Setup Service

setup: watch-install pre-commit

# Watch java project

watch:
	watchexec -r -e java,kt,properties,yml -w backend/src/main  -- docker-compose restart backend

# Start all services
start:
	docker-compose up --build -d

# Start all services
up: start watch

# Stop all running containers
stop:
	docker-compose down

# Remove all containers and images, but preserve named volumes like pgdata
clean:
	docker-compose down --rmi all --remove-orphans
