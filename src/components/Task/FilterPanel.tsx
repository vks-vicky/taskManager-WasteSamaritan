import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TaskStatus, Category, Tag } from "../../types/models";

interface Filters {
  status?: TaskStatus;
  categoryId?: string;
  tagIds: string[];
  searchQuery: string;
}

interface Props {
  categories: Category[];
  tags: Tag[];
  onChange: (filters: Filters) => void;
}

const FilterPanel: React.FC<Props> = ({ categories, tags, onChange }) => {
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    onChange({
      status: status || undefined,
      categoryId: categoryId || undefined,
      tagIds,
      searchQuery,
    });
  }, [status, categoryId, tagIds, searchQuery]);

  const handleClearFilters = () => {
    setStatus("");
    setCategoryId("");
    setTagIds([]);
    setSearchQuery("");
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <TextField
          label="Search"
          placeholder="Title or Description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value as TaskStatus | "")}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryId}
            label="Category"
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Tags</InputLabel>
          <Select
            multiple
            value={tagIds}
            onChange={(e) => setTagIds(e.target.value as string[])}
            input={<OutlinedInput label="Tags" />}
            renderValue={(selected) =>
              selected
                .map((id) => tags.find((tag) => tag.id === id)?.name)
                .join(", ")
            }
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                <Checkbox checked={tagIds.includes(tag.id)} />
                <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: tag.color,
                  }}
                />
                <ListItemText primary={tag.name} />
              </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button onClick={handleClearFilters} variant="outlined" size="small">
          Clear
        </Button>
      </Stack>
    </Box>
  );
};

export default FilterPanel;
