import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
  } from "recharts";
  import { Typography, Box } from "@mui/material";
  import { Task, Category } from "../../types/models";
  import { isBefore, parseISO } from "date-fns";
  import { useMemo } from "react";
  
  interface Props {
    tasks: Task[];
    categories: Category[];
  }
  
  const OverdueCategoryChart: React.FC<Props> = ({ tasks, categories }) => {
    const data = useMemo(() => {
      const now = new Date();
  
      // Count overdue tasks by category
      const counts: Record<string, number> = {};
      tasks.forEach((task) => {
        if (isBefore(new Date(task.dueDate), now) && task.status !== "done") {
          counts[task.categoryId] = (counts[task.categoryId] || 0) + 1;
        }
      });
  
      const result = categories.map((cat) => ({
        categoryId: cat.id,
        name: cat.name,
        count: counts[cat.id] || 0,
        color: cat.color,
      }));
  
      return result
        .filter((entry) => entry.count > 0)
        .sort((a, b) => b.count - a.count);
    }, [tasks, categories]);
  
    if (data.length === 0) {
      return (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No overdue tasks 🎉
          </Typography>
        </Box>
      );
    }
  
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Overdue Tasks by Category
        </Typography>
  
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => `${value} overdue`} />
            <Bar dataKey="count" barSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#ccc" strokeWidth={0.5} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };
  
  export default OverdueCategoryChart;
  