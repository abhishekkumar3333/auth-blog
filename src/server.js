import "dotenv/config";
import app from "./app.js";
import connectDb from "./config/db.js";
const startserver = async () => {
    try {
        await connectDb();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
startserver();
