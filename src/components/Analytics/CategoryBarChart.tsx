import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Typography, Box } from "@mui/material";
import { Task, Category } from "../../types/models";

interface Props {
  tasks: Task[];
  categories: Category[];
}

const CategoryBarChart: React.FC<Props> = ({ tasks, categories }) => {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach((task) => {
      counts[task.categoryId] = (counts[task.categoryId] || 0) + 1;
    });

    //mapping
    const result = categories.map((cat) => ({
      categoryId: cat.id,
      name: cat.name,
      count: counts[cat.id] || 0,
      color: cat.color,
    }));

    // Sorting
    result.sort((a, b) => b.count - a.count);
    return result;
  }, [tasks, categories]);

  // placeholder for no data
  if (data.length === 0) {
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
        Category Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" barSize={40} stroke="#000000" strokeWidth={0.8}>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
           </Bar>
        </BarChart>
      </ResponsiveContainer>
      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
        Total Tasks: {tasks.length}
      </Typography>
    </Box>
  );
};

export default CategoryBarChart;
