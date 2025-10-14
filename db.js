const mysql = require("mysql2/promise");

// Create connection pool to XAMPP MySQL
const pool = mysql.createPool({
  host: "localhost",      // XAMPP MySQL runs locally
  user: "root",           // default MySQL user
  password: "",           // default password is empty in XAMPP
  database: "booksdb",    // your database name (make sure it exists)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection (optional but useful for beginners)
pool.getConnection()
  .then(conn => {
    console.log("Connected to XAMPP MySQL successfully!");
    conn.release();
  })
  .catch(err => {
    console.error("Database connection failed:", err.message);
  });

module.exports = pool;
