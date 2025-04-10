import { useEffect, useState } from "react";
import TaskForm from "../components/Task/TaskForm";
import { Category, Tag } from "../types/models";
import { createTask } from "../firebase/taskService";
import { getAllCategories, createCategory } from "../firebase/categoryService";
import { getAllTags } from "../firebase/tagService";

const TaskDashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let cats = await getAllCategories();
      
      // Create default category if none exist
      if (cats.length === 0) {
        const defaultCat = await createCategory({
          name: "General",
          color: "#999999"
        });
        cats = [defaultCat];
      }

      const tgs = await getAllTags();
      setCategories(cats);
      setTags(tgs);
    };

    fetchData();
  }, []);

  const handleCreateTask = async (taskData: any) => {
    try {
      const newTask = await createTask(taskData);
      console.log("Created Task:", newTask);
      setShowForm(false); // hide form after task creation
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Task Management Dashboard</h2>

      {!showForm && (
        <button onClick={() => setShowForm(true)}>+ Add Task</button>
      )}

      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          categories={categories}
          tags={tags}
        />
      )}
    </div>
  );
};

export default TaskDashboard;
