# GraphQL Node + Express Example

This small project provides a simple GraphQL server using Express, `express-graphql` and an in-memory data store of books. It's intended for learning and quick experimentation.

## What this repository contains

- `server.js` — Express server that exposes the GraphQL endpoint at `/graphql`.
- `schema.js` — GraphQL schema defining `Book` type, queries and mutations.
- `data.js` — Simple in-memory array of books used as the data source.
- `package.json` — (assumed) project manifest. Dependencies used by the code: `express`, `express-graphql`, `graphql`, `cors`.

> Note: This project stores data in memory. All changes (add/update/delete) are lost when the server restarts.

## Prerequisites

- Node.js (recommend v14 or later)
- npm (comes with Node.js)

## Step-by-step setup

1. Open a terminal and change to the project directory (replace path if different):

```powershell
cd "d: to_your_respective_folder"
```

2. Install dependencies. If `package.json` already lists dependencies, run:

```powershell
npm install
```

If you prefer, install the required packages explicitly (this will add them to `package.json`):

```powershell
npm install express express-graphql graphql cors --save
```

3. Start the server:

```powershell
node server.js
```

If you want a convenient `npm start` script, add this to `package.json` under `scripts`:

```json
"scripts": {
  "start": "node server.js"
}
```

Then run:

```powershell
npm start
```

4. Open the GraphiQL UI in your browser to explore the API:

http://localhost:4000/graphql

## Example GraphQL queries and mutations

- Get all books:

```graphql
query {
  books {
    id
    title
    author
  }
}
```

- Get a book by id:

```graphql
query {
  book(id: 1) {
    id
    title
    author
  }
}
```

- Add a book (mutation):

```graphql
mutation {
  addBook(title: "New Book", author: "Author Name") {
    id
    title
    author
  }
}
```

- Update a book (mutation):

```graphql
mutation {
  updateBook(id: 1, title: "Updated Title", author: "Updated Author") {
    id
    title
    author
  }
}
```

- Delete a book (mutation):

```graphql
mutation {
  deleteBook(id: 2) {
    id
    title
  }
}
```

## Troubleshooting

- "Module not found" errors: make sure you ran `npm install` in the project root.
- Port already in use: change the port in `server.js` or stop the process using the port.
- Changes lost after restart: this is expected; `data.js` is an in-memory store. For persistence, connect to a database (e.g., SQLite, MongoDB, Postgres) and update `schema.js` resolvers accordingly.

## Extending the project

Ideas to practice:

- Persist books in a database (MongoDB with Mongoose, or Postgres).
- Add input validation and error handling on resolvers.
- Add pagination and filtering for the `books` query.
- Add unit tests for schema and resolvers.

## Contributing

This is a learning/example repository. Feel free to open issues or submit pull requests if you add improvements.

## License

This example is provided as-is for educational use and practise.
