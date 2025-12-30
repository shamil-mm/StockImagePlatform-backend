import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
process.on('SIGINT', () => {
  console.log('❌ Server stopped');
  process.exit(0);
});
