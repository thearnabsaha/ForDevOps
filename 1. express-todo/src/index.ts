import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

const todos: any = []
const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat));
app.use(helmet());

app.use(cors());

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});
app.get('/health', async (req, res) => {
    const start = Date.now();
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: new Date(),
        responseTime: `${Date.now() - start}ms`,
    };
    res.status(200).json(healthcheck);
});

app.get('/', (req, res) => {
    res.send('Its a beautiful world ;)');
    // res.send('Its a beautiful world!');
});
// GET all todos
app.get("/todos", (req, res) => {
    res.json(todos);
});

// GET single todo by ID
app.get("/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    //@ts-ignore
    const todo = todos.find(t => t.id === id);
    if (!todo) return res.status(404).send("Todo not found");
    res.json(todo);
});

// CREATE new todo
app.post("/todos", (req, res) => {
    const { title } = req.body;
    const newTodo = {
        id: todos.length + 1,
        title,
        completed: false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// UPDATE todo
app.put("/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    //@ts-ignore
    const todo = todos.find(t => t.id === id);
    if (!todo) return res.status(404).send("Todo not found");

    const { title, completed } = req.body;
    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    res.json(todo);
});

// DELETE todo
app.delete("/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    //@ts-ignore
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) return res.status(404).send("Todo not found");

    todos.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));