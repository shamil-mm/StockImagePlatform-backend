import express from "express";
import cors from "cors";
import AuthRoutes from './Routes/authRoutes'


const app = express();
const allowedOrigins = process.env.FRONTEND_URLS?.split(",") || [];

app.use(
  cors({
    origin: (origin, callback) => {
    
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

     
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.options("*", cors());


app.use(express.json());

app.use("/api/auth",AuthRoutes)

app.get("/", (_req, res) => {
  res.send("Stock Image API running");
});

export default app;
