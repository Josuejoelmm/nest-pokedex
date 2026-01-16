<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Run in development

1. Clone the repository
2. Run

```
npm i
```

3. Have Nest CLI installed

```
npm i -g @nestjs/cli
```

4. Set up Database

```
docker-compose up -d
```

5. Clone the file **.env.template** and rename the copy to **.env**

6. Fill the environment variables defined in the .env

7. Run the app in dev mode:

```
npm run start:dev
```

8. Rebuild Data base with the Seed

```
http://localhost:3000/api/v2/seed
```

## Stack used

- MongoDB
- NestJS
