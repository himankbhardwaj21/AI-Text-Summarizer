const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

const summaryRoutes = require("./routes/summaryRoutes");

app.use("/api/summarize", summaryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});