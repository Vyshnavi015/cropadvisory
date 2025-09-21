import { useState, useEffect } from "react"

export interface Todo {
  id: string
  text: string
  completed: boolean
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("todos")
    if (saved) setTodos(JSON.parse(saved))
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  function addTodo(text: string) {
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, completed: false },
    ])
  }

  function editTodo(id: string, newText: string) {
    setTodos((prev) => prev.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    ))
  }

  function toggleTodo(id: string) {
    setTodos((prev) => prev.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  return { todos, addTodo, editTodo, toggleTodo, deleteTodo }
}
