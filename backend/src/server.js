const express = require("express");
const cors = require("cors");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ name: "Help Desk API", status: "online" });
});

app.use("/api/tickets", ticketRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.listen(PORT, () => {
  console.log(`Help Desk API rodando em http://localhost:${PORT}`);
});
