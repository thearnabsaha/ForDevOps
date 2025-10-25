import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
// import { PrismaClient } from '@prisma/client';
import { prisma } from '@workspace/database/client'
dotenv.config();
const app = express();
const port = process.env.PORT || 3003;

const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat));
app.use(helmet());

app.use(cors({
    origin: process.env.CORS_URL,
    // origin: "http://localhost:3003",
    credentials: true,
}));
// app.use(cors({
//     origin: ["http://localhost:3000"],  // ✅ Allow frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Allow these HTTP methods
//     credentials: true, // ✅ Allow cookies if you use them
// }));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// Health check
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
    res.send('hello from simple server!');
});

// GET all todos
app.get("/todos", async (req, res) => {
    const todos = await prisma.todo.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(todos);
});

// GET single todo by ID
app.get("/todos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) return res.status(404).send("Todo not found");
    res.json(todo);
});

// CREATE new todo
app.post("/todos", async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).send("Title is required");

    const newTodo = await prisma.todo.create({
        data: { title }
    });
    res.status(201).json(newTodo);
});

// UPDATE todo
app.put("/todos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;

    try {
        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: {
                ...(title !== undefined ? { title } : {}),
                ...(completed !== undefined ? { completed } : {}),
            }
        });
        res.json(updatedTodo);
    } catch (error) {
        res.status(404).send("Todo not found");
    }
});

// DELETE todo
app.delete("/todos/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        await prisma.todo.delete({ where: { id } });
        res.status(204).send();
    } catch {
        res.status(404).send("Todo not found");
    }
});

app.listen(port, () => console.log(`> Server is up and running on port: ${port}`));
