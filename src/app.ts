import express from "express";
import cors from "cors";
import AuthRoutes from './Routes/authRoutes'


const app = express();

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}));
app.use(express.json());

app.use("/api/auth",AuthRoutes)

app.get("/", (_req, res) => {
  res.send("Stock Image API running");
});

export default app;
