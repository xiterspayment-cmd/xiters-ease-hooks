const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const EASE_SECRET = process.env.EASE_SECRET || null;  // defina no Render
const SERVICE_NAME = process.env.SERVICE_NAME || "Xiters";
const TICKET_URL = process.env.TICKET_URL || null;    // opcional

// Auth simples por header x-ease-secret (recomendado)
function auth(req, res, next) {
  if (!EASE_SECRET) return next();
  const token = req.headers["x-ease-secret"];
  if (token !== EASE_SECRET) return res.status(401).json({ error: "unauthorized" });
  next();
}

// Health
app.get("/", (req, res) => {
  res.json({ ok: true, name: SERVICE_NAME, uptime: process.uptime() });
});

// 1) CHECK STOCK -> só "continue". NÃO mande stock_count
app.post("/check_stock", auth, (req, res) => {
  return res.json({
    status: "continue",
    reason: null
  });
});

// 2) GET STOCK (pagamento aprovado) -> mensagens; NÃO mande stock_count nem items
app.post("/get_stock", auth, (req, res) => {
  const resp = {
    status: "success",
    items: [],
    is_to_make_delivery: false,
    message_to_delivery: `✅ Pagamento confirmado! Vamos iniciar seu serviço ${SERVICE_NAME} agora.`,
    message_helper: "Nossa equipe já foi notificada. Responda esta mensagem se precisar de algo."
  };

  if (TICKET_URL) {
    resp.additional_contents = {
      content: "Acompanhe seu atendimento pelo botão abaixo:",
      buttons: [{ label: "Abrir ticket", url: TICKET_URL }]
    };
  }

  return res.json(resp);
});

app.listen(PORT, () => console.log(`Ease Hooks ${SERVICE_NAME} ouvindo em :${PORT}`));
