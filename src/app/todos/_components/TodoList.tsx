"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit2, Check, X, AlertCircle, Circle, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import TodoFilters from "./TodoFilters";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  priority: "low" | "medium" | "high";
  category: string;
}

export default function TodoList() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      title: "Complete project proposal",
      completed: false,
      createdAt: new Date().toISOString(),
      priority: "high",
      category: "Work",
    },
    {
      id: "2",
      title: "Buy groceries",
      completed: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      priority: "medium",
      category: "Personal",
    },
    {
      id: "3",
      title: "Review code changes",
      completed: false,
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      priority: "medium",
      category: "Work",
    },
  ]);
  
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [newTodo, setNewTodo] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");
  const [newCategory, setNewCategory] = useState("Personal");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">("medium");
  const [editCategory, setEditCategory] = useState("");

  // Add new todo (UI only)
  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    
    const todo: Todo = {
      id: Date.now().toString(), // Simple ID generation for UI
      title: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      priority: newPriority,
      category: newCategory,
    };
    
    const updatedTodos = [todo, ...todos];
    setTodos(updatedTodos);
    setNewTodo("");
  };

  // Toggle todo completion (UI only)
  const handleToggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  // Delete todo (UI only)
  const handleDeleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  // Start editing
  const handleStartEdit = (id: string, currentText: string, priority: "low" | "medium" | "high", category: string) => {
    setEditingId(id);
    setEditText(currentText);
    setEditPriority(priority);
    setEditCategory(category);
  };

  // Save edit (UI only)
  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    
    const updatedTodos = todos.map(todo => 
      todo.id === editingId 
        ? { ...todo, title: editText.trim(), priority: editPriority, category: editCategory }
        : todo
    );
    setTodos(updatedTodos);
    setEditingId(null);
    setEditText("");
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const getPriorityIcon = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Circle className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <Circle className="h-4 w-4 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    }
  };

  const categories = Array.from(new Set(todos.map(todo => todo.category)));
  const completedCount = filteredTodos.filter(todo => todo.completed).length;
  const totalCount = filteredTodos.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Welcome back, {user?.name || user?.email}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your tasks efficiently
        </p>
      </div>

      {/* Filters */}
      <TodoFilters todos={todos} onFilterChange={setFilteredTodos} />

      {/* Add Todo Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="What needs to be done?"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
                className="flex-1"
              />
              <Button onClick={handleAddTodo} disabled={!newTodo.trim()}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select value={newPriority} onValueChange={(value: any) => setNewPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{totalCount - completedCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Remaining</div>
          </CardContent>
        </Card>
      </div>

      {/* Todo List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Tasks ({filteredTodos.length} of {todos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">📝</div>
              <p>No tasks found. {todos.length === 0 ? "Add one above to get started!" : "Try adjusting your filters."}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTodos.map((todo, index) => (
                <div key={todo.id}>
                  <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleTodo(todo.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        todo.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-green-400"
                      }`}
                    >
                      {todo.completed && <Check className="h-3 w-3" />}
                    </button>

                    {/* Todo Content */}
                    <div className="flex-1">
                      {editingId === todo.id ? (
                        <div className="space-y-3">
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Select value={editPriority} onValueChange={(value: any) => setEditPriority(value)}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select value={editCategory} onValueChange={setEditCategory}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Personal">Personal</SelectItem>
                                <SelectItem value="Work">Work</SelectItem>
                                <SelectItem value="Shopping">Shopping</SelectItem>
                                <SelectItem value="Health">Health</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button size="sm" onClick={handleSaveEdit}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`${
                                todo.completed
                                  ? "line-through text-gray-500 dark:text-gray-400"
                                  : "text-gray-800 dark:text-gray-200"
                              } font-medium`}
                            >
                              {todo.title}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            {getPriorityIcon(todo.priority)}
                            <Badge variant="secondary" className={getPriorityColor(todo.priority)}>
                              {todo.priority}
                            </Badge>
                            <Badge variant="outline">
                              {todo.category}
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-gray-400">
                            Created: {new Date(todo.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {editingId !== todo.id && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(todo.id, todo.title, todo.priority, todo.category)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {index < filteredTodos.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
