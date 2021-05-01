build with

`docker build -f deploy/dockerfile -t sygic:latest .`

run with

`docker run -p 8080:8080 -p 8088:8088 -v "$(pwd)"/logs:/app/logs -d sygic:latest`