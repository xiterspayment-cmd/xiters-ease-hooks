// Xiters – Hook para Ease Bot (itens infinitos + nomes mapeados)
const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const EASE_SECRET  = process.env.EASE_SECRET  || null;             // (opcional) header x-ease-secret
const SERVICE_NAME = process.env.SERVICE_NAME || "Xiters";
const INFINITE_STOCK = Number(process.env.INFINITE_STOCK || 999999);
const TICKET_URL   = process.env.TICKET_URL || null;               // opcional

// catálogo (nomes exatamente como aparecem no bot)
const CATALOG = new Map([
  ["VALORANT AIM LIFETIME", "VALORANT AIM LIFETIME"],
  ["VALORANT AIM MENSAL",   "VALORANT AIM MENSAL"],
  ["VALORANT AIM SEMANAL",  "VALORANT AIM SEMANAL"],
  ["VALORANT AIM DIÁRIO",   "VALORANT AIM DIÁRIO"],  // com acento
  ["teste produto",         "teste produto"]
]);

// auth simples (pode deixar liberado tirando a checagem abaixo)
function auth(req, res, next) {
  if (!EASE_SECRET) return next();
  const token = req.headers["x-ease-secret"];
  if (token !== EASE_SECRET) return res.status(401).json({ error: "unauthorized" });
  next();
}

// health
app.get("/", (_req, res) => res.json({ ok: true, name: SERVICE_NAME, uptime: process.uptime() }));

// util: pega nome do item do payload e “alinha” com o catálogo
function resolveItemName(body) {
  const raw = body?.product?.item?.name || body?.product?.name || "Produto";
  const hit = CATALOG.get(raw) || raw; // se não achar no catálogo, usa o que veio
  return hit;
}

// 1) checar disponibilidade – SEMPRE em estoque (evita zerar no bot)
app.post("/check_stock", auth, (req, res) => {
  const item = resolveItemName(req.body);
  console.log("CHECK_STOCK =>", item);
  return res.json({
    status: "continue",
    stock_count: INFINITE_STOCK, // número grande para nunca travar
    reason: null
  });
});

// 2) após pagamento aprovado – só mensagem (não mexe em estoque)
app.post("/get_stock", auth, (req, res) => {
  const item = resolveItemName(req.body);
  console.log("GET_STOCK =>", item, "order:", req.body?.order);

  const resp = {
    status: "success",
    items: [],
    is_to_make_delivery: false,
    message_to_delivery: `✅ Pagamento confirmado! Seu **${item}** foi ativado. Vamos iniciar o serviço ${SERVICE_NAME} agora.`,
    message_helper: "Nossa equipe já foi notificada. Se precisar, responda esta mensagem."
  };

  if (TICKET_URL) {
    resp.additional_contents = {
      content: "Acompanhe seu atendimento:",
      buttons: [{ label: "Abrir ticket", url: TICKET_URL }]
    };
  }

  return res.json(resp);
});

app.listen(PORT, () => console.log(`Ease Hooks ${SERVICE_NAME} rodando na porta ${PORT}`));
