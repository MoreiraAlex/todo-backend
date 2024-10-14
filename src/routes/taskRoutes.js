// /routes/taskRoutes.js
const express = require("express");
const { listTasks, listTasksById, createTask, updateTask, deleteTaskById } = require("../controllers/taskController");
const authenticateToken = require("../middleware/authMiddleware");
const { validateInputs } = require("../utils/validators");

const router = express.Router();

// Listar todas as tarefas
router.get("/", 
  // authenticateToken, 
  listTasks);

// Exibir uma tarefa
router.get("/:id", 
  // authenticateToken, 
  listTasksById);

// Adicionar uma nova tarefa
router.post("/",
  // authenticateToken,
  validateInputs,
  createTask
);

// Atualizar uma tarefa
router.put("/:id",
  // authenticateToken,
  validateInputs,
  updateTask
);

// Remover uma tarefa
router.delete("/:id", 
  // authenticateToken, 
  deleteTaskById);

module.exports = router;
