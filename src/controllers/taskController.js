const { v4: uuidv4 } = require("uuid");
const redisClient = require("../config/redisClient");
let Task = require("../models/task.model");

// Listar todas as tarefas 
const listTasks = async (req, res) => {
  try {
    // Verifica se as tarefas estão no cache do Redis
    const cachedTasks = await redisClient.get("tasks");
    
    if (cachedTasks) {
      return res.status(200).json(JSON.parse(cachedTasks));
    }

    // Buscar todas as tarefas do MongoDB
    const tasks = await Task.find();

    // Armazenar no cache do Redis
    await redisClient.set("tasks", JSON.stringify(tasks));

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefas", error });
  }
};


//Exibe uma tarefa por ID
const listTasksById = async (req, res) => {
  try {
    const { id } = req.params; // Obtendo o ID da tarefa da URL

    // Verifica se a tarefa está no cache do Redis
    const cachedTask = await redisClient.get(`task:${id}`);
    
    if (cachedTask) {
      return res.status(200).json(JSON.parse(cachedTask));
    }

    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    // Armazenar a tarefa no cache do Redis para futuras requisições
    await redisClient.set(`task:${id}`, JSON.stringify(task));

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefa", error });
  }
};


// Adicionar nova tarefa
const createTask = async (req, res) => {
  try {
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

    const task = new Task({
      id: uuidv4(),
      title,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority,
      status,
    });

    await task.save();

    // Limpar cache de tarefas após adicionar nova
    await redisClient.del("tasks");

    res.status(201).json({ message: "Tarefa adicionada com sucesso!", task });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar a tarefa", error });
  }
};


// Atualizar tarefa
const updateTask = async (req, res) => {
  const { id } = req.params; // Obtendo o ID da tarefa da URL
  let { title, description, priority, status } = req.body;

  try {
    // Validar título
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "O título da tarefa é obrigatório." });
    }

    // Manter a prioridade e status em 0 se não forem válidos ou não fornecidos
    if (typeof priority !== 'number' || priority < 0 || priority > 2) {
      priority = 0;
    }

    if (typeof status !== 'number' || status < 0 || status > 2) {
      status = 0;
    }

    // Atualizar a tarefa no MongoDB
    const task = await Task.findByIdAndUpdate(id,{
        title,
        description,
        priority,
        status,
        updatedAt: new Date().toISOString(),
      },
      { new: true } // Retornar a tarefa atualizada
    );

    if (!task) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    // Limpar cache de tarefas após atualizar
    await redisClient.del("tasks");

    res.status(200).json({ message: "Tarefa atualizada com sucesso!", task });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar a tarefa", error });
  }
};


// Remover tarefa
const deleteTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // Remover a tarefa no MongoDB
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    // Limpar o cache do Redis
    await redisClient.del("tasks");

    res.status(200).json({ message: "Tarefa removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover a tarefa", error });
  }
};


module.exports = {
  listTasks,
  listTasksById,
  createTask,
  updateTask,
  deleteTaskById
};
