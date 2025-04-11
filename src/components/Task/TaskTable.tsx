import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Typography,
  Box,
  Tooltip,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Task, Category, Tag } from "../../types/models";
import { useState } from "react";

interface Props {
  tasks: Task[];
  categories: Category[];
  tags: Tag[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskTable: React.FC<Props> = ({ tasks, categories, tags, onEdit, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getCategoryName = (id: string) =>
    categories.find(cat => cat.id === id)?.name || "Unknown";

  const renderTagBadges = (ids: string[]) => (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {ids.map(id => {
        const tag = tags.find(t => t.id === id);
        if (!tag) return null;
        return (
          <Box
            key={id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              backgroundColor: "#eee",
              borderRadius: 2,
              px: 1,
              py: 0.3,
              fontSize: "0.75rem",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: tag.color,
              }}
            />
            {tag.name}
          </Box>
        );
      })}
    </Stack>
  );
  

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTasks = tasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {tasks.length === 0 ? (
        <Typography variant="body1">No tasks found.</Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Tags</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
              <TableBody>
                {paginatedTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{getCategoryName(task.categoryId)}</TableCell>
                    <TableCell>{renderTagBadges(task.tagIds)}</TableCell>
                    <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => onEdit(task)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => onDelete(task.id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={tasks.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
    </Box>
  );
};

export default TaskTable;
