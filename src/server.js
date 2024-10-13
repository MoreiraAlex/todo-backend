// server.js
const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const { port } = require("./config/keys");

const app = express();

// Middlewares de segurança
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(express.urlencoded({ extended: true }));

// Limitação de requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
});
app.use(limiter);

// Rotas
app.use("/auth", authRoutes);


// Inicializar servidor HTTPS
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
