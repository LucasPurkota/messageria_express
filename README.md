# Messageria Express

Messageria Express is a message API with node.

## Required APIs

Auth API https://github.com/gustavo-szesz/auth-api
Record API https://github.com/luksbrn/ProjetoDB/tree/main/Projeto/PythonDB

## Get Starting

1. Clone the repository.
2. install modules.
```bash
npm install
```
3. Install and run Redis image in docker
```bash

```
5. Instal and run RabbitMQ image in docker
```bash
docker pull rabbitmq:3-management
docker run --rm -it -p 8080:15672 -p 5672:5672 rabbitmq:3-management
```
6. Run aplication.
```bash
cd src
node app.js
```
Open http://localhost:3000 with your browse to see result.

## Developer
Lucas Daniel Purkota

E-mail: lucaspurkota@gmail.com
###
<a href="https://www.linkedin.com/in/lucas-purkota-9b2305239/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>
<a href="https://www.instagram.com/lucas_purkota/" target="_blank"><img src="https://img.shields.io/badge/-Instagram-%23E4405F?style=for-the-badge&logo=instagram&logoColor=white" target="_blank"></a>
