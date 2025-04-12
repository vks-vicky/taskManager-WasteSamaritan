import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  import { Typography, Box } from "@mui/material";
  import { Task } from "../../types/models";
  
  const COLORS = ["#1976d2", "#ffa726", "#66bb6a"];
  
  const STATUS_LABELS: Record<string, string> = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };
  
  interface Props {
    tasks: Task[];
  }
  
  const TaskStatusPieChart: React.FC<Props> = ({ tasks }) => {
    const statusCounts = tasks.reduce<Record<string, number>>((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
  
    const chartData = Object.entries(statusCounts).map(([status, count]) => ({
      name: STATUS_LABELS[status] ?? status,
      value: count,
    }));
  
    const total = chartData.reduce((sum, d) => sum + d.value, 0);
  
    if (chartData.length === 0) {
      return (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No data available to render chart.
          </Typography>
        </Box>
      );
    }
  
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Task Status Distribution
        </Typography>
  
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
  
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Total Tasks: {total}
        </Typography>
      </Box>
    );
  };
  
  export default TaskStatusPieChart;
  