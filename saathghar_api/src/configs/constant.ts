import dotenv from "dotenv";
dotenv.config(); 

// Add fallback value from env for stability
export const PORT: number = Number(process.env.PORT) || 8089;
export const DUMMY: string = process.env.DUMMY || "Export dummy constant";    
export const MONGODB_URL: string = 
    process.env.MONGODB_URL || "mongodb://localhost:27017/saath-ghar-db";
export const SECRET_KEY: string = 
    process.env.SECRET_KEY || "saath_ghar_key";
