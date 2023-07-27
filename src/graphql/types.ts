const typeDefs = `#graphql

scalar DateTime

type User {
  id: Int
  username: String
  updatedAt: DateTime
}

type Movie {
  id: Int
  movieName: String
  description: String
  directorName: String
  releaseDate: DateTime
  updatedAt: DateTime
  creatorId: Int
}


type Query {
  movieById(movieId: Int!): Movie
  findMovies(
      orderBy: OrderMovieByReleaseDate, 
      findString: String, 
      skip: Int, 
      take: Int
  ): [Movie]
}

input OrderMovieByReleaseDate {
  releaseDate: SortingOrder!
}

enum SortingOrder {
  asc
  desc
}


type Mutation {
  signUp(
      username: String!,
      password: String!,
      email: String!    
  ): String

  login(
      username: String!,
      password: String!,
  ): String

  changePassword(
      userId: Int!,
      password: String!,
      newPassword: String!
  ): User
  createMovie(
      movieName: String!,
      description: String!,
      directorName: String!,
      releaseDate: DateTime,
      userId: Int!,
  ): Movie

  updateMovie(
      movieId: Int!,
      movieName: String,
      description: String,
      directorName: String,
      releaseDate: DateTime,
  ): Movie
  
  deleteMovie(movieId: Int!): Movie
}

`;
type GetMovieByIdArgs = {
  movieId: number;
};

type FindMoviesArgs = {
  findString: string;
  skip: number;
  take: number;
  orderBy: {
    releaseDate: "asc" | "desc";
  };
};
type UserFromJWT = {
  id: number;
  username: string;
};

export { typeDefs, GetMovieByIdArgs, FindMoviesArgs, UserFromJWT };
