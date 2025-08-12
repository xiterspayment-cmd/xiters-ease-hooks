import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Rota de teste para saber se o servidor está online
app.get("/", (req, res) => {
  res.send("Xiters Hook está rodando! 🚀");
});

// Verificar estoque (sempre infinito)
app.post("/check_stock", (req, res) => {
  console.log("CHECK_STOCK recebido:", req.body);

  res.json({
    status: "continue",   // diz ao Ease para prosseguir com a venda
    stock_count: 999999,  // estoque infinito
    reason: null
  });
});

// Entregar produto (não altera estoque)
app.post("/get_stock", (req, res) => {
  console.log("GET_STOCK recebido:", req.body);

  res.json({
    status: "success", // sucesso na entrega
    items: [], // vazio, pois você não envia item físico
    is_to_make_delivery: false, // não é entrega física
    message_to_delivery: "✅ Pagamento confirmado! Seu serviço Xiters foi ativado.",
    message_helper: "A equipe foi notificada."
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
