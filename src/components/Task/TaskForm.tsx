import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Stack,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { TaskStatus, Category, Tag, Task } from "../../types/models";

interface Props {
  onSubmit: (data: {
    title: string;
    description?: string;
    status: TaskStatus;
    categoryId: string;
    tagIds: string[];
    dueDate: string;
    createdAt?: string;
  }) => void;
  categories: Category[];
  tags: Tag[];
  initialData?: Task;
}

const TaskForm: React.FC<Props> = ({ onSubmit, categories, tags, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setStatus(initialData.status);
      setCategoryId(initialData.categoryId);
      setTagIds(initialData.tagIds);
      setDueDate(initialData.dueDate.split("T")[0]); // for <input type="date">
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      status,
      categoryId,
      tagIds,
      dueDate,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    });
  };

  const toggleTag = (tagId: string) => {
    setTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h6">
          {initialData ? "Edit Task" : "Create Task"}
        </Typography>

        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryId}
            label="Category"
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl component="fieldset">
          <Typography variant="subtitle1" gutterBottom>
            Tags
          </Typography>
          <FormGroup row>
            {tags.map((tag) => (
              <FormControlLabel
                key={tag.id}
                control={
                  <Checkbox
                    checked={tagIds.includes(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                  />
                }
                label={tag.name}
              />
            ))}
          </FormGroup>
        </FormControl>

        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />

        <Button type="submit" variant="contained" color="primary">
          {initialData ? "Update Task" : "Create Task"}
        </Button>
      </Stack>
    </Box>
  );
};

export default TaskForm;
