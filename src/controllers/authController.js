const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");
const users = require("../models/userModel");

async function registerUser(req, res) {
  const { username, password } = req.body;
  const userExists = users.find(user => user.username === username);
  
  if (userExists) {
    return res.status(400).json({ message: "Usuário já existe" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  
  res.status(201).json({ message: "Usuário registrado com sucesso!" });
}

async function loginUser(req, res) {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  
  if (!user) return res.status(400).json({ message: "Usuário não encontrado" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ message: "Senha incorreta" });

  const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1h' });
  
  res.json({ message: "Login realizado com sucesso", token });
}

module.exports = {
  registerUser,
  loginUser,
};
