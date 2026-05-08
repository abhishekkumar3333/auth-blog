import express from "express";
import cors from "cors";
import path from "path";
import { router } from "./routes.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/v1", router);

export default app;



// PORT=3000
// DB_URL=mongodb://abhishekkumar:abhi12345@ac-v8q8trd-shard-00-00.jzv9xqa.mongodb.net:27017,ac-v8q8trd-shard-00-01.jzv9xqa.mongodb.net:27017,ac-v8q8trd-shard-00-02.jzv9xqa.mongodb.net:27017/?ssl=true&replicaSet=atlas-5xaei8-shard-0&authSource=admin&appName=Cluster9
// JWT_SECRET=Kj7xP9@Lm2$qW8!nZ5^rT1&vB4*Hs6
// EMAIL_USER=abhishekatter3@gmail.com
// PASS_USER=mruazyhicfvsuuyf