## Simple Forum
A simple forum built with NextJS. <br>
Uses json web tokens for authentication. <br>
The secret (next.config.js) is used to sign the JWT token which is used for user authentication and should be changed in case you want to host this project. <br>
The database used is SQLite with Prisma.
Icons from Heroicons.

## Features

- Registration and login
- Create posts while logged in or not ("Anonymous" posts)
- Editing and deletion of posts by Author of post


## To run dev server

First you need to install the dependencies. <br>
    ```
    npm install
    ```<br>
Next you need to migrate the database.  <br>
    ```
    prisma migrate dev --name init
    ```<br>
Then you can run the dev server. <br>
    ```
    npm run dev
    ``` 

    

