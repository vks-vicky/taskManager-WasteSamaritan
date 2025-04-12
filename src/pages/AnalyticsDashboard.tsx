import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";
import { Task, Category } from "../types/models";
import { getAllTasks } from "../firebase/taskService";
import { getAllCategories } from "../firebase/categoryService";
import TaskStatusPieChart from "../components/Analytics/TaskStatusPieChart";
import CategoryBarChart from "../components/Analytics/CategoryBarChart";
import TaskTimelineChart from "../components/Analytics/TaskTimelineChart";
import OverdueCategoryChart from "../components/Analytics/OverdueCategoryChart";
import { exportAnalyticsToExcel } from "../utils/exportAnalytics";
import { useToast } from "../hooks/useToast";

const AnalyticsDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const { showToast, Toast } = useToast();

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

  const handleExport = async () => {
    try {
      setExporting(true);
      await exportAnalyticsToExcel(tasks, categories);
      showToast("Analytics exported to Excel!", "success");
    } catch (err) {
      console.error("Export failed", err);
      showToast("Failed to export analytics.", "error");
    } finally {
      setExporting(false);
    }
  };

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

      {/* Export Button */}
      <Stack direction="row" sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          onClick={handleExport}
          disabled={exporting}
          startIcon={exporting ? <CircularProgress size={18} /> : null}
        >
          {exporting ? "Exporting..." : "Export Analytics"}
        </Button>
      </Stack>

      {/* Charts */}
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

        {/* Category Distribution Bar Chart */}
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

        {/* Task Creation Timeline */}
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
            <TaskTimelineChart tasks={tasks} />
          </CardContent>
        </Card>

        {/* Overdue Tasks by Category */}
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

      {Toast}
    </Box>
  );
};

export default AnalyticsDashboard;
