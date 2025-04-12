import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    IconButton,
    Stack,
  } from "@mui/material";
  import EditIcon from "@mui/icons-material/Edit";
  import DeleteIcon from "@mui/icons-material/Delete";
  import CircleIcon from "@mui/icons-material/Circle";
  import { Task, Category, Tag } from "../../types/models";
  
  interface Props {
    tasks: Task[];
    categories: Category[];
    tags: Tag[];
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
  }
  
  const TaskCardView: React.FC<Props> = ({ tasks, categories, tags, onEdit, onDelete }) => {
    const getCategory = (id: string) =>
      categories.find((cat) => cat.id === id);
  
    const getTagInfo = (ids: string[]) =>
      ids.map((id) => tags.find((tag) => tag.id === id)).filter(Boolean);
  
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {tasks.map((task) => {
          const category = getCategory(task.categoryId);
          const tagList = getTagInfo(task.tagIds);
  
          return (
            <Box
              key={task.id}
              sx={{
                width: {
                  xs: "100%", // full width on mobile
                  sm: "47%",
                  md: "31%",
                  lg: "23%",
                },
                minWidth: 260,
                boxSizing: "border-box",
              }}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {task.title}
                  </Typography>
  
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 0.5 }}
                  >
                    {task.description?.slice(0, 100) ?? "No description"}
                    {task.description && task.description.length > 100
                    ? `${task.description.slice(0, 100)}...`
                    : task.description ?? "No description"}

                  </Typography>
  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ mt: 1 }}
                  >
                    Status: {task.status}
                  </Typography>
  
                  {category && (
                    <Chip
                      label={category.name}
                      size="small"
                      sx={{
                        backgroundColor: category.color,
                        color: "#fff",
                        mb: 1,
                      }}
                    />
                  )}
  
                  <Typography variant="body2" gutterBottom>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
  
                  {/* Tags */}
                  <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                    {tagList.map((tag) => (
                      <Chip
                      key={tag!.id}
                      label={tag!.name}
                      size="small"
                      icon={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CircleIcon fontSize="small" sx={{ color: tag!.color }} />
                        </Box>
                      }
                    />                    
                    ))}
                  </Stack>
                </CardContent>
  
                {/* Action buttons */}
                <Box sx={{ px: 2, pb: 2, mt: "auto" }}>
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => onEdit(task)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(task.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Stack>
                </Box>
              </Card>
            </Box>
          );
        })}
      </Box>
    );
  };
  
  export default TaskCardView;
  