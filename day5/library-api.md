# Library Books REST API Design

This document outlines the REST API design for managing a library's `books` resource.

---

## Endpoints

### 1. List All Books
- **Method:** `GET`
- **Path:** `/api/v1/books`
- **Description:** Retrieves a list of all books available in the library.
- **Success Status Code:** `200 OK`

---

### 2. Get a Specific Book
- **Method:** `GET`
- **Path:** `/api/v1/books/:id`
- **Description:** Retrieves full details for a single book by its unique ID.
- **Success Status Code:** `200 OK`

---

### 3. Create a New Book
- **Method:** `POST`
- **Path:** `/api/v1/books`
- **Description:** Adds a new book to the library catalog.
- **Example Request Body:**
  ```json
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "9780743273565",
    "publishedYear": 1925,
    "available": true
  }