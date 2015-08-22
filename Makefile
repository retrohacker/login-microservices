default:
	docker-compose build
	docker-compose up
clean:
	yes | docker-compose rm
