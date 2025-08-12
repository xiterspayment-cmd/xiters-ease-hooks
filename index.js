const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SERVICE_NAME = process.env.SERVICE_NAME || "Xiters";
const INFINITE_STOCK = Number(process.env.INFINITE_STOCK || 999999);

app.get("/", (_req, res) => res.json({ ok: true, name: SERVICE_NAME, uptime: process.uptime() }));

app.post("/check_stock", (req, res) => {
  console.log("CHECK_STOCK payload ok");
  res.json({ status: "continue", stock_count: INFINITE_STOCK, reason: null });
});

app.post("/get_stock", (req, res) => {
  console.log("GET_STOCK payload ok");
  res.json({
    status: "success",
    items: [],
    is_to_make_delivery: false,
    message_to_delivery: `✅ Pagamento confirmado! Vamos iniciar seu serviço ${SERVICE_NAME} agora.`,
    message_helper: "Nossa equipe foi notificada."
  });
});

app.listen(PORT, () => console.log(`Ease Hooks ${SERVICE_NAME} rodando :${PORT}`));
