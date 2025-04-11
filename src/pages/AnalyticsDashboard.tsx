import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { Task, Category } from "../types/models";
import { getAllTasks } from "../firebase/taskService";
import { getAllCategories } from "../firebase/categoryService";
import TaskStatusPieChart from "../components/Analytics/TaskStatusPieChart";
import CategoryBarChart from "../components/Analytics/CategoryBarChart";
import TaskTimelineChart from "../components/Analytics/TaskTimelineChart";
import OverdueCategoryChart from "../components/Analytics/OverdueCategoryChart";


const AnalyticsDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const tsks = await getAllTasks();
      const cats = await getAllCategories();
      setTasks(tsks);
      setCategories(cats);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Analytics Dashboard
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "space-between",
        }}
      >
        {/* Task Status Pie Chart */}
        <Card
          sx={{
            flex: "1 1 48%",
            minWidth: 300,
            boxShadow: 3,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
          }}
        >
          <CardContent>
            <TaskStatusPieChart tasks={tasks} />
          </CardContent>
        </Card>

        {/* Category Bar Chart */}
        <Card
            sx={{
            flex: "1 1 48%",
            minWidth: 300,
            boxShadow: 3,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
          }}
        >
          <CardContent>
            <CategoryBarChart tasks={tasks} categories={categories} />
          </CardContent>
        </Card>

          {/* Task Timeline Chart */}
        <Card
            sx={{
            flex: "1 1 48%",
            boxShadow: 3,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            }}
        >
            <CardContent>
            <TaskTimelineChart tasks={tasks} />
            </CardContent>
        </Card>
        
        <Card
            sx={{
                flex: "1 1 48%",
                minWidth: 300,
                boxShadow: 3,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
            }}
        >
        <CardContent>
            <OverdueCategoryChart tasks={tasks} categories={categories} />
        </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AnalyticsDashboard;