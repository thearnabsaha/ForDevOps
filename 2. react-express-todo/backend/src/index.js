"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 3000;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const todos = [];
const morganFormat = ':method :url :status :response-time ms';
app.use((0, morgan_1.default)(morganFormat));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json({ limit: '16kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '16kb' }));
app.use(express_1.default.static('public'));
app.use((0, cookie_parser_1.default)());
app.get('/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const start = Date.now();
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: new Date(),
        responseTime: `${Date.now() - start}ms`,
    };
    res.status(200).json(healthcheck);
}));
app.get('/', (req, res) => {
    res.send('hello from simple server :)');
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
    if (!todo)
        return res.status(404).send("Todo not found");
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
    if (!todo)
        return res.status(404).send("Todo not found");
    const { title, completed } = req.body;
    if (title !== undefined)
        todo.title = title;
    if (completed !== undefined)
        todo.completed = completed;
    res.json(todo);
});
// DELETE todo
app.delete("/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    //@ts-ignore
    const index = todos.findIndex(t => t.id === id);
    if (index === -1)
        return res.status(404).send("Todo not found");
    todos.splice(index, 1);
    res.status(204).send();
});
app.listen(port, () => console.log('> Server is up and running on port: ' + port));
