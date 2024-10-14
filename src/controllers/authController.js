const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");
const User = require("../models/user.model");

// Registrar um novo usuário
async function registerUser(req, res) {
  const { username, password } = req.body;

  try {
    // Verificar se o usuário já existe
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    // Hash da senha do usuário
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar um novo usuário e salvar no banco de dados
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    
    await newUser.save(); // Salvar o usuário no MongoDB

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar o usuário", error });
  }
}

// Login de um usuário
async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    // Procurar o usuário no banco de dados
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    // Verificar a senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Senha incorreta" });
    }

    // Gerar um token JWT
    const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1h' });

    res.json({ message: "Login realizado com sucesso", token });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
}

module.exports = {
  registerUser,
  loginUser,
};
