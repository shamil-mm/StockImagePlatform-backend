import express from "express";
import cors from "cors";
import AuthRoutes from './Routes/authRoutes'


const app = express();
const allowedOrigins = [
  "https://stock-image-platform-frontend-blush.vercel.app",
  "https://stock-image-platform-frontend-git-main-shamil-m-ms-projects.vercel.app",
  "https://stock-image-platform-frontend-l3jdgwfup-shamil-m-ms-projects.vercel.app",
];

app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  }));
app.use(express.json());

app.use("/api/auth",AuthRoutes)

app.get("/", (_req, res) => {
  res.send("Stock Image API running");
});

export default app;
