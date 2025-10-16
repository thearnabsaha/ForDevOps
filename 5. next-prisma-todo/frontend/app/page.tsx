"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// const API = "http://localhost:3003/todos"; // <-- change to your Express port
const API = `${process.env.NEXT_PUBLIC_API_URL}/todos`; // <-- change to your Express port

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const res = await axios.get<Todo[]>(API, { withCredentials: true });
      setTodos(res.data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
  };

  // Add new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const res = await axios.post<Todo>(
        API,
        { title: newTodo },
        { withCredentials: true }
      );
      setTodos([...todos, res.data]);
      setNewTodo("");
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  // Toggle completion
  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const res = await axios.put<Todo>(
        `${API}/${id}`,
        { completed: !todo.completed },
        { withCredentials: true }
      );
      setTodos(todos.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error("Failed to toggle todo:", err);
    }
  };

  // Delete todo
  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`${API}/${id}`, { withCredentials: true });
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          ✅ Todo App
        </h1>

        {/* Add new todo */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>

        {/* Todo list */}
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              <span
                onClick={() => toggleTodo(todo.id)}
                className={`flex-1 cursor-pointer ${todo.completed
                  ? "line-through text-gray-400"
                  : "text-gray-800"
                  }`}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="ml-4 px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No todos yet!</p>
        )}
      </div>
    </main>
  );
}
