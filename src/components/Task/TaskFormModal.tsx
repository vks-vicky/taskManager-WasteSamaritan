import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  import { Category, Tag, Task } from "../../types/models";
  import TaskForm from "./TaskForm";
  
  interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    categories: Category[];
    tags: Tag[];
    initialData?: Task;
  }
  
  const TaskFormModal: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
    categories,
    tags,
    initialData,
  }) => {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {initialData ? "Edit Task" : "Create Task"}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TaskForm
            onSubmit={(data) => {
              onSubmit(data);
              onClose();
            }}
            categories={categories}
            tags={tags}
            initialData={initialData}
          />
        </DialogContent>
      </Dialog>
    );
  };
  
  export default TaskFormModal;
  