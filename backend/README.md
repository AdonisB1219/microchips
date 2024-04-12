# Express API Bootstrap (base / project starter)

This is a repository intended to serve as a starting point if you want to bootstrap a express API project.

## Running the app

- Create `.env` file based on `.example.env`

```sh
# install dependencies
npm i

# run migrations
npmx prisma migrate dev

# run in dev mode on port 3300
npm run dev

# if you already run migrations, you can run the following command to start the server
npmx prisma generate

# run in prod mode on port 3300
npm build
```
