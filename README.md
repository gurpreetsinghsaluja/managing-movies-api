# Movie Management System using GraphQL

- 👋 Hi, I'm Gurpreet Singh. Email: gsaluja2@uwo.ca
- 🎬 This is a Express.js GraphQL API project written in TypeScript, using the Apollo GraphQL library(Apollo Server), JWT for authentication and Prisma ORM for interacting with a PostgreSQL database. The API is designed for managing movies and users in a database.
- 🔐 Users can sign up and log in, while also having the ability to change their passwords. As for the movie management, users can create, read, update, and delete movies. Additionally, there's functionality for searching and filtering the movie list.
- ✨ A detailed feature list is listed below:
  - 👤 User Operations
    - SignUp as a User: Users can sign up using their name, email, and password.
    - Login: Users can log in with their email and password.
    - Change Password: Passwords can be changed at will.
    - The user data includes:
      ID (Auto Increment)
      User Name
      Email ID
      Password (hashed)
  - 🍿 Movie Operations
    - Query all movies: Get a list of all the movies in the database.
    - Query a movie: Get specific movie details with its ID.
    - Create a movie: Add a new movie.
    - Update a movie: Update details of an existing movie.
    - Delete a movie: Remove a movie from the database.
    - The movie data includes:
      ID (Auto Increment)
      Movie Name
      Description
      Director Name
      Release Date
  - 🔒 Authorization and Authentication
    - Registration and Login system is in place to secure the operations.
    - Passwords are hashed for additional security.
    - JWT tokens are used to authenticate requests.
    - Only authenticated users can perform Create, Update, or Delete operations on movies.
