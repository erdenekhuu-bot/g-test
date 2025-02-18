import dotenv from "dotenv";

dotenv.config();

// Load environment-specific variables during development
if (process.env.NODE_ENV !== "production") {
     dotenv.config();
}

export const ROOT_DIR = process.cwd();
export const SERVER_PORT = process.env.PORT || 3008;
export const DATABASE_URL =
     process.env.DATABASE_URL || "postgresql://admin:admin@localhost:1433/Test-system?schema=public";
export const APP_SECRET_KEY = process.env.APP_SECRET_KEY || "mysecretkey";
