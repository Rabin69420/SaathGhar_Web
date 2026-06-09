import app from "./src/app";
// importing same variable 
import { PORT as API_PORT } from "./src/configs/constant";
import { connectMongoDB } from "./src/database/mogodb";

connectMongoDB();

app.listen(
    API_PORT,  // start backend in this PORT
    () => {
        console.log(`Server: http://localhost:${API_PORT}`); // backtick
    }
);
// execute: npx tsx --watch index.ts
// http://localhost:8089