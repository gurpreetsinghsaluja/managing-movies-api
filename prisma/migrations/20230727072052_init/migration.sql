-- Creating User table
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- Creating Movie table
CREATE TABLE "Movies" (
    "id" SERIAL NOT NULL,
    "movieName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "directorName" TEXT NOT NULL,
    "releaseDate" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" INTEGER NOT NULL,
    CONSTRAINT "Movies_pkey" PRIMARY KEY ("id")
);

-- Creating Unique Indexes
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- Adding Foreign Key
ALTER TABLE "Movies" ADD CONSTRAINT "Movies_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
