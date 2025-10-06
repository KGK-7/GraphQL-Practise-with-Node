import React, { useEffect, useState } from "react";
import { request, gql } from "graphql-request";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:4000/graphql";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [editBook, setEditBook] = useState(null);

  const buttonStyle = {
    backgroundColor: "grey",
    color: "white",
    border: "none",
  };

  const buttonHoverStyle = {
    backgroundColor: "#333",
  };

  // Fetch all books
  const fetchBooks = async () => {
    const query = gql`
      {
        books {
          id
          title
          author
        }
      }
    `;
    const data = await request(API, query);
    setBooks(data.books);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Add or update book
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editBook) {
      const mutation = gql`
        mutation UpdateBook($id: Int!, $title: String, $author: String) {
          updateBook(id: $id, title: $title, author: $author) {
            id
            title
            author
          }
        }
      `;
      await request(API, mutation, { id: editBook.id, title, author });
      setEditBook(null);
    } else {
      const mutation = gql`
        mutation AddBook($title: String!, $author: String!) {
          addBook(title: $title, author: $author) {
            id
            title
            author
          }
        }
      `;
      await request(API, mutation, { title, author });
    }
    setTitle("");
    setAuthor("");
    fetchBooks();
  };

  // Delete book
  const handleDelete = async (id) => {
    const mutation = gql`
      mutation DeleteBook($id: Int!) {
        deleteBook(id: $id) {
          id
        }
      }
    `;
    await request(API, mutation, { id });
    fetchBooks();
  };

  // Edit book
  const handleEdit = (book) => {
    setEditBook(book);
    setTitle(book.title);
    setAuthor(book.author);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Books CRUD with GraphQL and React</h2>

      {/* Book Form */}
      <form
        onSubmit={handleSubmit}
        className="d-flex justify-content-center mb-4"
      >
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-control w-25 me-2"
        />
        <input
          type="text"
          placeholder="Author Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="form-control w-25 me-2"
        />
        <button
          className="btn"
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "black")}
        >
          {editBook ? "Update" : "Add"} Book
        </button>
      </form>

      {/* Books Table */}
      <table className="table table-bordered table-striped text-center">
        <thead className="table-light">
          <tr>
            <th style={{ width: "10%" }}>ID</th>
            <th style={{ width: "35%" }}>Title</th>
            <th style={{ width: "35%" }}>Author</th>
            <th style={{ width: "20%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>
                <button
                  className="btn me-2"
                  style={buttonStyle}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#333")
                  }
                  onMouseOut={(e) => (e.target.style.backgroundColor = "black")}
                  onClick={() => handleEdit(b)}
                >
                  Edit
                </button>
                <button
                  className="btn"
                  style={buttonStyle}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#333")
                  }
                  onMouseOut={(e) => (e.target.style.backgroundColor = "black")}
                  onClick={() => handleDelete(b.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
