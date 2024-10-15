# To-Do List API (Back-end)

## Sobre o Projeto

Este projeto consiste em uma API desenvolvida em Node.js para gerenciar uma lista de tarefas (To-Do List). A API permite criar, atualizar, remover e listar tarefas, integrando-se com MongoDB para armazenamento persistente e Redis para cache. A autenticação é feita com JWT para garantir que apenas usuários autenticados possam acessar certas funcionalidades.

## Endpoint da API
A API foi hospedada na Render e está disponível na seguinte URL:
```bash
https://todo-backend-a972.onrender.com
```

## Funcionalidades

- **Adicionar nova tarefa**: Permite criar uma nova tarefa com título, descrição, prioridade e status.
- **Atualizar tarefa**: Altera os dados de uma tarefa existente, incluindo título, descrição, prioridade e status.
- **Atualizar status da tarefa**: Muda o status de uma tarefa para "pendente", "em andamento" ou "concluído".
- **Remover tarefa**: Exclui uma tarefa da lista.
- **Listar tarefas**: Exibe todas as tarefas salvas no banco de dados, com detalhes sobre cada uma.

## Como Rodar o Projeto

### Pré-requisitos

- **Node.js** (versão 20 ou superior)
- **MongoDB** (para persistência de dados)
- **Redis** (para cache)
- **Git** (para versionamento)
- **npm** (gerenciador de pacotes)

### Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/MoreiraAlex/todo-backend.git backend
    ```

2. Navegue até a pasta do back-end:
    ```bash
    cd backend
    ```

3. Instale as dependências:
    ```bash
    npm install
    ```

4. Crie um arquivo `.env` na raiz do projeto e adicione suas variáveis de ambiente:
    ```bash
    PORT=3000
    JWT_SECRET=123
    DB_USER=user
    DB_PASS=pass
    ```

5. Inicie o servidor:
    ```bash
    npm start
    ```

O servidor estará rodando em `http://localhost:3000`.

## Rotas da API

### Usuario

### **POST /auth/register**
Cria um novo usuario

### **POST /auth/login**
Valida usuario e devolve token de autenticação

### Tarefas

### **POST /tasks**
Cria uma nova tarefa.

### **GET /tasks**
Lista todas as tarefas.

### **PUT /tasks/:id**
Atualiza uma tarefa existente.

### **DELETE /tasks/:id**
Remove uma tarefa.

### **POST /login**
Autentica o usuário e retorna um token JWT.

## Segurança

- A API utiliza **JWT (JSON Web Tokens)** para autenticação. Apenas usuários autenticados podem adicionar, atualizar e remover tarefas.
- Todos os dados são validados para evitar entradas maliciosas.

## Tecnologias Utilizadas

- **Node.js**
- **Express**
- **MongoDB**
- **Redis**
- **JWT para autenticação**
