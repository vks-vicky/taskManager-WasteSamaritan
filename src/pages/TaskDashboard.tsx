import { useEffect, useState } from "react";
import TaskForm from "../components/Task/TaskForm";
import TaskTable from "../components/Task/TaskTable";
import FilterPanel from "../components/Task/FilterPanel";
import TaskFormModal from "../components/Task/TaskFormModal";
import { Task, Category, Tag, TaskStatus } from "../types/models";
import { Button } from "@mui/material";
import {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
} from "../firebase/taskService";
import {
  getAllCategories,
  createCategory,
} from "../firebase/categoryService";
import { getAllTags } from "../firebase/tagService";

const TaskDashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<{
    status?: TaskStatus;
    categoryId?: string;
    tagIds: string[];
    searchQuery: string;
  }>({
    status: undefined,
    categoryId: undefined,
    tagIds: [],
    searchQuery: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      let cats = await getAllCategories();
      if (cats.length === 0) {
        const generalCat = await createCategory({
          name: "General",
          color: "#999999",
        });
        cats = [generalCat];
      }

      const tgs = await getAllTags();
      const tsks = await getAllTasks();

      setCategories(cats);
      setTags(tgs);
      setTasks(tsks);
    };

    fetchData();
  }, []);

  const handleCreateTask = async (taskData: any) => {
    try {
      const newTask = await createTask(taskData);
      setTasks((prev) => [...prev, newTask]);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTask = async (updatedData: any) => {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, updatedData);
      setTasks(prev =>
        prev.map(t => (t.id === editingTask.id ? { ...t, ...updatedData } : t))
      );
      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const confirm = window.confirm("Are you sure you want to delete this task?");
    if (!confirm) return;
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchStatus = !filters.status || task.status === filters.status;
    const matchCategory = !filters.categoryId || task.categoryId === filters.categoryId;
    const matchTags =
      filters.tagIds.length === 0 || filters.tagIds.every(id => task.tagIds.includes(id));
    const matchSearch =
      task.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      (task.description ?? "").toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchStatus && matchCategory && matchTags && matchSearch;
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Task Management Dashboard</h2>

      {!showForm && (
        <Button variant="contained" onClick={() => setShowForm(true)}>
        + Add Task
      </Button>
      )}

      {showForm && (
        <TaskFormModal
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          categories={categories}
          tags={tags}
          initialData={editingTask ?? undefined}
      />
      )}

      <FilterPanel
        categories={categories}
        tags={tags}
        onChange={(f) => setFilters(f)}
      />

      <TaskTable
        tasks={filteredTasks}
        categories={categories}
        tags={tags}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default TaskDashboard;
