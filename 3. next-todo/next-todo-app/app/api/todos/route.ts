import { NextResponse } from "next/server";
import { todos, Todo } from "@/lib/todos";

export async function GET() {
    return NextResponse.json(todos);
}

export async function POST(req: Request) {
    const { title } = await req.json();
    const newTodo: Todo = {
        id: todos.length + 1,
        title,
        completed: false,
    };
    todos.push(newTodo);
    return NextResponse.json(newTodo, { status: 201 });
}
