-- Modifying Movie table
ALTER TABLE "Movies" ADD COLUMN "updatedAt" TIMESTAMP(2) NOT NULL,
DROP COLUMN "releaseDate",
ADD COLUMN "releaseDate" TIMESTAMP(2) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Modifying User table
ALTER TABLE "Users" ADD COLUMN "updatedAt" TIMESTAMP(2) NOT NULL;
