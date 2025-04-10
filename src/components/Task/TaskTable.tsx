import React, { useState } from "react";
import { Task, Category, Tag } from "../../types/models";

interface Props {
  tasks: Task[];
  categories: Category[];
  tags: Tag[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TASKS_PER_PAGE = 5;

const TaskTable: React.FC<Props> = ({ tasks, categories, tags, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof Task>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const getCategoryName = (id: string) =>
    categories.find(cat => cat.id === id)?.name || "Unknown";

  const getTagNames = (ids: string[]) =>
    ids.map(id => tags.find(tag => tag.id === id)?.name || "Unknown").join(", ");

  const sortedTasks = [...tasks].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (typeof valA === "string" && typeof valB === "string") {
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return 0;
  });

  const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
  const paginatedTasks = sortedTasks.slice(startIndex, startIndex + TASKS_PER_PAGE);

  const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);

  const handleSort = (key: keyof Task) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "2rem" }}>
        <thead>
          <tr>
            <th style={cellStyle} onClick={() => handleSort("title")}>Title ⬍</th>
            <th style={cellStyle} onClick={() => handleSort("status")}>Status ⬍</th>
            <th style={cellStyle}>Category</th>
            <th style={cellStyle}>Tags</th>
            <th style={cellStyle} onClick={() => handleSort("dueDate")}>Due Date ⬍</th>
            <th style={cellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTasks.map(task => (
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

      {/* Pagination Controls */}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
          Previous
        </button>
        <span style={{ margin: "0 1rem" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
};

const cellStyle: React.CSSProperties = {
  padding: "0.75rem",
  border: "1px solid #ccc",
  textAlign: "left",
  cursor: "pointer",
};

export default TaskTable;
