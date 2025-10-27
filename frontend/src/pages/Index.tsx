import { useState, useEffect } from "react";
import { Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  task_text: string;
  is_completed: boolean;
  created_at: string;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // API endpoint - configure this to point to your AWS API Gateway
  const API_BASE_URL = "/api"; // Change this to your API Gateway URL when ready

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // For development: initialize with empty array if backend not ready
      setTasks([]);
    }
  };

  const addTask = async () => {
    if (!newTaskText.trim()) {
      toast({
        title: "Task cannot be empty",
        description: "Please enter a task description",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const tempId = crypto.randomUUID();
    const newTask: Task = {
      id: tempId,
      task_text: newTaskText,
      is_completed: false,
      created_at: new Date().toISOString(),
    };

    // Optimistic UI update
    setTasks([...tasks, newTask]);
    setNewTaskText("");

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task_text: newTaskText,
        }),
      });

      if (response.ok) {
        const createdTask = await response.json();
        // Update with actual task from backend
        setTasks((prev) =>
          prev.map((t) => (t.id === tempId ? createdTask : t))
        );
        toast({
          title: "Task added",
          description: "Your task has been created successfully",
        });
      } else {
        // Rollback on error
        setTasks((prev) => prev.filter((t) => t.id !== tempId));
        toast({
          title: "Failed to add task",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding task:", error);
      // Keep optimistic update for demo purposes if backend not ready
      toast({
        title: "Demo Mode",
        description: "Task added locally (backend not connected)",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, is_completed: !t.is_completed } : t
      )
    );

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_completed: !task.is_completed,
        }),
      });

      if (!response.ok) {
        // Rollback on error
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, is_completed: task.is_completed } : t
          )
        );
        toast({
          title: "Failed to update task",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      // Keep optimistic update for demo purposes
    }
  };

  const deleteTask = async (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);

    // Optimistic UI update
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Task deleted",
          description: "Your task has been removed",
        });
      } else {
        // Rollback on error
        if (taskToDelete) {
          setTasks((prev) => [...prev, taskToDelete]);
        }
        toast({
          title: "Failed to delete task",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Demo Mode",
        description: "Task deleted locally (backend not connected)",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      addTask();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            My Task Tracker
          </h1>
          <p className="text-muted-foreground">
            Stay organized and productive
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8">
          {/* Add Task Form */}
          <div className="flex gap-3 mb-8">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 h-12 text-base"
              disabled={isLoading}
            />
            <Button
              onClick={addTask}
              disabled={isLoading || !newTaskText.trim()}
              className="h-12 px-6 gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Task
            </Button>
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">No tasks yet</p>
                <p className="text-sm mt-1">Add your first task to get started</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-all ${
                    task.is_completed ? "opacity-60" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <Checkbox
                    checked={task.is_completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="h-5 w-5"
                  />

                  {/* Task Text */}
                  <span
                    className={`flex-1 text-base transition-all ${
                      task.is_completed
                        ? "line-through text-[hsl(var(--completed-text))]"
                        : "text-card-foreground"
                    }`}
                  >
                    {task.task_text}
                  </span>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Task Counter */}
          {tasks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border text-sm text-muted-foreground text-center">
              {tasks.filter((t) => !t.is_completed).length} task
              {tasks.filter((t) => !t.is_completed).length !== 1 ? "s" : ""}{" "}
              remaining
            </div>
          )}
        </div>

        {/* API Configuration Note */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground text-center">
          <p className="font-medium text-foreground mb-1">
            Backend Configuration
          </p>
          <p>
            Update <code className="bg-muted px-2 py-0.5 rounded">API_BASE_URL</code> in the component to point to your AWS API Gateway endpoint
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
