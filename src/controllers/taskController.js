const { v4: uuidv4 } = require("uuid");
const redisClient = require("../config/redisClient");
let taskModel = require("../models/taskModel");

// Listar todas as tarefas 
const listTasks = async (req, res) => {
  const cachedTasks = await redisClient.get("tasks");
  
  if (cachedTasks) {
    return res.json(JSON.parse(cachedTasks));
  }
  
  const tasks = taskModel;
  console.log(tasks)
  await redisClient.set("tasks", JSON.stringify(tasks), { EX: 60 });
  res.json(tasks);
};


//Exibe uma tarefa por ID
const listTasksById = async (req, res) => {
  const { id } = req.params; // Obtendo o ID da tarefa da URL

  // Verifica se a tarefa está no cache do Redis
  const cachedTask = await redisClient.get(`task:${id}`);
  
  if (cachedTask) {
    return res.status(200).json(JSON.parse(cachedTask));
  }

  // Busca a tarefa pelo ID no modelo local
  const task = taskModel.find(task => task.id === id);
  
  if (!task) {
    return res.status(404).json({ message: "Tarefa não encontrada." });
  }

  // Armazenar a tarefa no cache do Redis para futuras requisições
  await redisClient.set(`task:${id}`, JSON.stringify(task));

  res.status(200).json(task);
};


// Adicionar nova tarefa
const createTask = async (req, res) => {
  let { title, description, priority, status } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "O título da tarefa é obrigatório." });
  }

  if (typeof priority !== 'number' || priority < 0 || priority > 2) {
    priority = 0;
  }

  if (typeof status !== 'number' || status < 0 || status > 2) {
    status = 0;
  }

  const task = {
    id: uuidv4(),
    title,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority,
    status,
  };

  taskModel.push(task)

  // Limpar cache de tarefas após adicionar nova
  await redisClient.del("tasks");

  res.status(201).json({ message: "Tarefa adicionada com sucesso!", task });
};


// Atualizar tarefa
const updateTask = async (req, res) => {
  const { id } = req.params; // Obtendo o ID da tarefa da URL
  let { title, description, priority, status } = req.body;

  let taskIndex = taskModel.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Tarefa não encontrada." });
  }

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "O título da tarefa é obrigatório." });
  }

  if (typeof priority !== 'number' || priority < 0 || priority > 2) {
    priority = taskModel[taskIndex].priority;
  }

  if (typeof status !== 'number' || status < 0 || status > 2) {
    status = taskModel[taskIndex].status;
  }

  const task = {
    id: taskModel[taskIndex].id,
    title,
    description,
    createdAt: taskModel[taskIndex].createdAt,
    updatedAt: new Date().toISOString(),
    priority,
    status,
  };

  taskModel[taskIndex] = task;

  // Limpar cache de tarefas após atualizar
  await redisClient.del("tasks");

  res.status(200).json({ message: "Tarefa atualizada com sucesso!", task: taskModel[taskIndex]});
};


// Remover tarefa
const deleteTaskById = async (req, res) => {
  const { id } = req.params;

  taskModel = taskModel.filter(task => task.id !== id);

  // Limpar cache após a exclusão
  await redisClient.del("tasks");

  res.status(200).json({ message: "Tarefa removida com sucesso!" });
};


module.exports = {
  listTasks,
  listTasksById,
  createTask,
  updateTask,
  deleteTaskById
};
