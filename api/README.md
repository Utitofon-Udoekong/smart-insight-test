## Setting Up the local api

### Prerequisites:

- Node.js and npm installed
- A MySQL server running
- A MySQL database created

### Step 1: Clone this repository

1. Clone this repository to your machine
2. Open a terminal and navigate to the project api directory. 

```bash
cd PROJECT/api
```

### Step 2: Install Dependencies

Install the necessary dependencies:

```bash
npm install
```

### Step 3: Setup MySQL

To setup MySQL:
- Open your MySQL client (e.g., MySQL Workbench, command-line client) and connect to your server.
- Create the database:
```SQL
CREATE DATABASE your_database_name;
```
The value you use here will be set in the DB_NAME variable in the env file

- Create the users, comment and post tables, setting up relationships between them:
```SQL
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    userId VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE comments (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    postId VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY (postId) REFERENCES posts(id)
);
```


### Step 4: Modify env placeholders

Create a .env file an add the following: 

```bash
DB_HOST=localhost:3000
DB_USER=root
DB_PASSWORD=password
DB_NAME=users
DB_CREATE_AUTHORIZATION=SET_DB_CREATE_AUTHORIZATION_TO_ANY_KEY_OR_TOKEN
```
- Replace `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` with your actual MySQL server credentials and database name.
- Replace `DB_CREATE_AUTHORIZATION` with an authorization token to use when testing.
An env.example file is present to show what variables to use.
### Step 5: Run the Server

```bash
npm run dev
```

This will start your Node.js server and test the database connection. If the connection is successful, you should see a message in the console. You can then access the API endpoint at `http://localhost:{PORT}/api/v1` to retrieve data from your database. Start by testing hitting the url `http://localhost:{PORT}/api/v1/users` on postman or any api client.

**Additional Notes:**

- All tests are to be done locally. 
- The user/create endpoint will be hit every hour. You can modify the duration variable to test it at different time intervals
- Postman API DOCS AT [Postman documentation reference](https://www.postman.com/aerospace-technologist-82445773/workspace/my-workspace/api/de3909d2-2e13-406c-a93b-3b8453d19f7c/collection/28244939-572800b0-091c-4aeb-9a16-c3edb5912249?action=share&source=copy-link&creator=28244939)

By following these steps, you can set up the Node.js API connected to a MySQL database.
