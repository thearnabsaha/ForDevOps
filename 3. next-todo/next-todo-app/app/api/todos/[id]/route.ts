import { NextResponse } from "next/server";
import { todos } from "@/lib/todos";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    const todo = todos.find(t => t.id === id);
    if (!todo) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(todo);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    const todo = todos.find(t => t.id === id);
    if (!todo) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const { title, completed } = await req.json();
    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    return NextResponse.json(todo);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });
    todos.splice(index, 1);
    return NextResponse.json({}, { status: 204 });
}
