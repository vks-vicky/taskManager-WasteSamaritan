import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Stack,
} from "@mui/material";
import TaskTable from "../components/Task/TaskTable";
import TaskCardView from "../components/Task/TaskCardView";
import FilterPanel from "../components/Task/FilterPanel";
import TaskFormModal from "../components/Task/TaskFormModal";
import { Task, Category, Tag, TaskStatus } from "../types/models";
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
import { exportTasksToExcel } from "../utils/exportUtils";
import { useToast } from "../hooks/useToast";

const TaskDashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [exporting, setExporting] = useState(false);

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

  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const { showToast, Toast } = useToast();

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

      const listener = () => setShowForm(true);
      window.addEventListener("openTaskForm", listener);
      return () => window.removeEventListener("openTaskForm", listener);
    };

    fetchData();
  }, []);

  const handleCreateTask = async (taskData: any) => {
    try {
      const newTask = await createTask(taskData);
      setTasks((prev) => [...prev, newTask]);
      setShowForm(false);
      showToast("Task created successfully!", "success");
    } catch (error) {
      console.error("Error creating task:", error);
      showToast("Error creating task", "error");
    }
  };

  const handleUpdateTask = async (updatedData: any) => {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, updatedData);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id ? { ...t, ...updatedData } : t
        )
      );
      setEditingTask(null);
      setShowForm(false);
      showToast("Task updated successfully!", "success");
    } catch (error) {
      console.error("Error updating task:", error);
      showToast("Error updating task", "error");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const confirm = window.confirm("Are you sure you want to delete this task?");
    if (!confirm) return;
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showToast("Task deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting task:", error);
      showToast("Error deleting task", "error");
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await exportTasksToExcel(tasks, categories, tags);
      showToast("All tasks exported to Excel!", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showToast("Failed to export all tasks.", "error");
    } finally {
      setExporting(false);
    }
  };

  const handleExportFiltered = async () => {
    try {
      setExporting(true);
      await exportTasksToExcel(filteredTasks, categories, tags);
      showToast("Filtered tasks exported to Excel!", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showToast("Failed to export filtered tasks.", "error");
    } finally {
      setExporting(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchStatus = !filters.status || task.status === filters.status;
    const matchCategory = !filters.categoryId || task.categoryId === filters.categoryId;
    const matchTags =
      filters.tagIds.length === 0 ||
      filters.tagIds.every((id) => task.tagIds.includes(id));
    const matchSearch =
      task.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      (task.description ?? "").toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchStatus && matchCategory && matchTags && matchSearch;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Task Management Dashboard
      </Typography>

      {/* Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setShowForm(true)}>
          + Add Task
        </Button>
        <Button
          variant="outlined"
          onClick={handleExport}
          disabled={exporting}
          startIcon={exporting ? <CircularProgress size={18} /> : null}
        >
          {exporting ? "Exporting..." : "Export All"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleExportFiltered}
          disabled={exporting}
          startIcon={exporting ? <CircularProgress size={18} /> : null}
        >
          {exporting ? "Exporting..." : "Export Filtered"}
        </Button>
      </Stack>

      {/* Form Modal */}
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

      {/* Filters */}
      <FilterPanel
        categories={categories}
        tags={tags}
        onChange={(f) => setFilters(f)}
      />

      {/* View Toggle */}
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(e, val) => val && setViewMode(val)}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="list">List</ToggleButton>
        <ToggleButton value="card">Card</ToggleButton>
      </ToggleButtonGroup>

      {/* Task Views */}
      {viewMode === "list" ? (
        <TaskTable
          tasks={filteredTasks}
          tags={tags}
          categories={categories}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      ) : (
        <TaskCardView
          tasks={filteredTasks}
          tags={tags}
          categories={categories}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}

      {Toast}
    </Box>
  );
};

export default TaskDashboard;
