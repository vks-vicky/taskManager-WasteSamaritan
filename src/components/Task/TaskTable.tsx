import React from "react";
import { Task, Category, Tag } from "../../types/models";

interface Props {
  tasks: Task[];
  categories: Category[];
  tags: Tag[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskTable: React.FC<Props> = ({ tasks, categories, tags, onEdit, onDelete }) => {
  const getCategoryName = (id: string) =>
    categories.find(cat => cat.id === id)?.name || "Unknown";

  const getTagNames = (ids: string[]) =>
    ids.map(id => tags.find(tag => tag.id === id)?.name || "Unknown").join(", ");

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "2rem" }}>
      <thead>
        <tr>
          <th style={cellStyle}>Title</th>
          <th style={cellStyle}>Status</th>
          <th style={cellStyle}>Category</th>
          <th style={cellStyle}>Tags</th>
          <th style={cellStyle}>Due Date</th>
          <th style={cellStyle}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map(task => (
          <tr key={task.id}>
            <td style={cellStyle}>{task.title}</td>
            <td style={cellStyle}>{task.status}</td>
            <td style={cellStyle}>{getCategoryName(task.categoryId)}</td>
            <td style={cellStyle}>{getTagNames(task.tagIds)}</td>
            <td style={cellStyle}>{new Date(task.dueDate).toLocaleDateString()}</td>
            <td style={cellStyle}>
              <button onClick={() => onEdit(task)} style={{ marginRight: "0.5rem" }}>Edit</button>
              <button onClick={() => onDelete(task.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const cellStyle: React.CSSProperties = {
  padding: "0.75rem",
  border: "1px solid #ccc",
  textAlign: "left"
};

export default TaskTable;
