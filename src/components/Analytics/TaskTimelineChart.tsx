import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
  } from "recharts";
  import { Box, Typography } from "@mui/material";
  import { Task } from "../../types/models";
  import { useMemo } from "react";
  import { format, parseISO } from "date-fns";
  
  interface Props {
    tasks: Task[];
  }
  
  const TaskTimelineChart: React.FC<Props> = ({ tasks }) => {
    const data = useMemo(() => {
      const grouped: Record<string, number> = {};
  
      tasks.forEach((task) => {
        const dateKey = format(new Date(task.createdAt), "yyyy-MM-dd");
        grouped[dateKey] = (grouped[dateKey] || 0) + 1;
      });
  
      return Object.entries(grouped)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [tasks]);
  
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
          Task Creation Timeline
        </Typography>
  
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(date) => format(parseISO(date), "MMM d")}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => `${value} task(s)`}
              labelFormatter={(label) => format(parseISO(label), "PPP")}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#1976d2"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    );
  };
  
  export default TaskTimelineChart;
  