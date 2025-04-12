import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Task, Category, Tag } from "../types/models";

export const exportTasksToExcel = (
  tasks: Task[],
  categories: Category[],
  tags: Tag[]
) => {
  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]));
  const tagMap = Object.fromEntries(tags.map(t => [t.id, t.name]));

  const data = tasks.map(task => ({
    Title: task.title,
    Description: task.description || "",
    Status: task.status,
    Category: categoryMap[task.categoryId] || "Unknown",
    Tags: task.tagIds.map(id => tagMap[id]).join(", "),
    "Due Date": task.dueDate,
    "Created At": task.createdAt
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

  const filename = `TaskExport_${new Date().toISOString().slice(0, 10)}.xlsx`;
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  saveAs(blob, filename);
};
