import "dotenv/config";
import app from "./app.js";
import connectDb from "./config/db.js";

const startserver = async () => {
    try {
        await connectDb();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

startserver();  