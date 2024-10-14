const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { port, dbUser, dbPass } = require("./config/keys");
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

// Habilitar CORS
app.use(cors());


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
app.use("/tasks", taskRoutes);


// Conectar ao MongoDB
mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster.76cof.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`)
.then(() => console.log("Conectado ao MongoDB"))
.catch((err) => console.error("Erro ao conectar ao MongoDB", err));


// Inicializar servidor HTTPS
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
