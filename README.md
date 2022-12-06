## Simple Forum
A simple forum built with NextJS. <br>
Uses json web tokens for authentication. <br>
The secret used for JWT auth is stored in next.config.js. <br>
The secret is used to sign the JWT token and should be changed in case you want to host this project. <br>
The database used is SQLite with Prisma.
Icons from Heroicons.

## Features

- Registration and login
- Create posts while logged in or not ("Anonymous" posts)
- Editing and deletion of posts by Author of post


## To run dev server

First you need to install the dependencies. <br>
    ```bash
    npm install
    ```<br>
Next you need to migrate the database.  <br>
    ```bash
    prisma migrate dev --name init
    ```<br>
Then you can run the dev server. <br>
    ```bash
    npm run dev
    ``` 

    

