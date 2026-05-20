import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import brokerRoutes from "./routes/brokers";

const app = express();
const port = process.env.API_PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api/brokers", brokerRoutes);

app.listen(port, () => {
  console.log(`Express API server running on http://localhost:${port}`);
});
