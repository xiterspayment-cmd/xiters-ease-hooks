// Xiters – Hooks para Ease Bot (estoque infinito)
const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const EASE_SECRET  = process.env.EASE_SECRET  || null;      // defina no Render
const SERVICE_NAME = process.env.SERVICE_NAME || "Xiters";
const TICKET_URL   = process.env.TICKET_URL   || null;      // opcional
const INFINITE_STOCK = Number(process.env.INFINITE_STOCK || 999999); // evita zerar

function auth(req, res, next) {
  if (!EASE_SECRET) return next();
  const token = req.headers["x-ease-secret"];
  if (token !== EASE_SECRET) return res.status(401).json({ error: "unauthorized" });
  next();
}

// Healthcheck
app.get("/", (_req, res) => res.json({ ok:true, name:SERVICE_NAME, uptime:process.uptime() }));

// 1) Checar disponibilidade – SEMPRE libera e devolve estoque alto
app.post("/check_stock", auth, (req, res) => {
  // Ignoramos qual item é: tudo é “infinito”
  return res.json({
    status: "continue",
    stock_count: INFINITE_STOCK,   // <- chave que impede zerar
    reason: null
  });
});

// 2) Pós-pagamento aprovado – só mensagens (não mexe em estoque)
app.post("/get_stock", auth, (req, res) => {
  const resp = {
    status: "success",
    items: [],
    is_to_make_delivery: false,
    message_to_delivery: `✅ Pagamento confirmado! Vamos iniciar seu serviço ${SERVICE_NAME} agora.`,
    message_helper: "Nossa equipe foi notificada. Responda esta mensagem se precisar de algo."
  };
