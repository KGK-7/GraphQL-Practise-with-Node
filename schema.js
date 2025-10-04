const { 
  GraphQLObjectType, 
  GraphQLSchema, 
  GraphQLList, 
  GraphQLInt, 
  GraphQLString, 
  GraphQLNonNull 
} = require("graphql");

const books = require("./data");

//Book type
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    author: { type: GraphQLString },
  }),
});

//Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    books: {
      type: new GraphQLList(BookType),
      resolve() {
        return books;
      },
    },
    book: {
      type: BookType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return books.find(book => book.id === args.id);
      },
    },
  },
});

//Mutation Section
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addBook: {
      type: BookType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const newBook = {
          id: books.length + 1,
          title: args.title,
          author: args.author,
        };
        books.push(newBook);
        return newBook;
      },
    },
    deleteBook: {
      type: BookType,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve(parent, args) {
        const index = books.findIndex(b => b.id === args.id);
        if (index === -1) return null;
        return books.splice(index, 1)[0];
      },
    },
    updateBook: {
      type: BookType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLString },
        author: { type: GraphQLString },
      },
      resolve(parent, args) {
        const book = books.find(b => b.id === args.id);
        if (!book) return null;
        if (args.title) book.title = args.title;
        if (args.author) book.author = args.author;
        return book;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
