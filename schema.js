const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} = require("graphql");

const pool = require("./db"); // MySQL connection (db.js)

// -------------------
// Book Type
// -------------------
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    author: { type: GraphQLString },
  }),
});

// -------------------
// Root Query
// -------------------
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // Get all books
    books: {
      type: new GraphQLList(BookType),
      resolve: async () => {
        const [rows] = await pool.query("SELECT * FROM Books");
        return rows;
      },
    },
    // Get single book by ID
    book: {
      type: BookType,
      args: { id: { type: GraphQLInt } },
      resolve: async (parent, args) => {
        const [rows] = await pool.query("SELECT * FROM Books WHERE id = ?", [args.id]);
        return rows[0];
      },
    },
  },
});

// -------------------
// Mutations (CRUD)
// -------------------
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // Add new book
    addBook: {
      type: BookType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const [result] = await pool.query(
          "INSERT INTO Books (title, author) VALUES (?, ?)",
          [args.title, args.author]
        );
        return { id: result.insertId, title: args.title, author: args.author };
      },
    },

    // Delete book
    deleteBook: {
      type: BookType,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: async (parent, args) => {
        const [rows] = await pool.query("SELECT * FROM Books WHERE id = ?", [args.id]);
        if (rows.length === 0) return null;
        await pool.query("DELETE FROM Books WHERE id = ?", [args.id]);
        return rows[0];
      },
    },

    // Update book (supports partial updates)
    updateBook: {
      type: BookType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLString },
        author: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const fields = [];
        const values = [];

        if (args.title) {
          fields.push("title = ?");
          values.push(args.title);
        }
        if (args.author) {
          fields.push("author = ?");
          values.push(args.author);
        }

        if (fields.length === 0) return null;

        values.push(args.id);
        await pool.query(`UPDATE Books SET ${fields.join(", ")} WHERE id = ?`, values);

        const [rows] = await pool.query("SELECT * FROM Books WHERE id = ?", [args.id]);
        return rows[0];
      },
    },
  },
});

// -------------------
// Export Schema
// -------------------
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
