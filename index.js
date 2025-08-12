const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const EASE_SECRET = process.env.EASE_SECRET || null;
const SERVICE_NAME = process.env.SERVICE_NAME || "Xiters";
const TICKET_URL = process.env.TICKET_URL || null;

// Autenticação simples (opcional)
function auth(req, res, next) {
  if (!EASE_SECRET) return next();
  const token = req.headers["x-ease-secret"];
  if (token !== EASE_SECRET) return res.status(401).json({ error: "unauthorized" });
  next();
}

// Endpoint de teste
app.get("/", (req, res) => {
  res.json({ ok: true, name: SERVICE_NAME, uptime: process.uptime() });
});

// Hook 1 - Checar disponibilidade
app.post("/check_stock", auth, (req, res) => {
  return res.json({
    status: "continue",
    stock_count: null,
    reason: null
  });
});

// Hook 2 - Puxar item (serviço)
app.post("/get_stock", auth, (req, res) => {
  return res.json({
    status: "success",
    items: [],
    is_to_make_delivery: false,
    message_to_delivery: `✅ Pagamento confirmado! Vamos iniciar seu serviço ${SERVICE_NAME}.`,
    message_helper: "Nossa equipe já foi notificada e entrará em contato.",
    additional_contents: TICKET_URL
      ? { content: "Acesse seu ticket:", buttons: [{ label: "Abrir ticket", url: TICKET_URL }] }
      : null,
    stock_count: null
  });
});

app.listen(PORT, () => {
  console.log(`Ease Hooks rodando na porta ${PORT}`);
});
