import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Task, Category } from "../types/models";
import { isBefore } from "date-fns";

export const exportAnalyticsToExcel = (tasks: Task[], categories: Category[]) => {
  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

  const total = tasks.length;
  const statusCounts = {
    todo: tasks.filter(t => t.status === "todo").length,
    "in-progress": tasks.filter(t => t.status === "in-progress").length,
    done: tasks.filter(t => t.status === "done").length,
  };

  const overdueCount = tasks.filter(
    t => t.status !== "done" && isBefore(new Date(t.dueDate), new Date())
  ).length;

  const categoryCounts = categories.map(cat => {
    const count = tasks.filter(t => t.categoryId === cat.id).length;
    return {
      name: cat.name,
      count,
      percent: total ? ((count / total) * 100).toFixed(1) + "%" : "0%",
    };
  });

  const statusPercentages = {
    todo: total ? ((statusCounts.todo / total) * 100).toFixed(1) + "%" : "0%",
    "in-progress": total ? ((statusCounts["in-progress"] / total) * 100).toFixed(1) + "%" : "0%",
    done: total ? ((statusCounts.done / total) * 100).toFixed(1) + "%" : "0%",
  };

  // Summary
  const summaryData = [
    ["Metric", "Count", "Percentage"],
    ["Total Tasks", total, "100%"],
    ["To Do", statusCounts.todo, statusPercentages.todo],
    ["In Progress", statusCounts["in-progress"], statusPercentages["in-progress"]],
    ["Done", statusCounts.done, statusPercentages.done],
    ["Overdue", overdueCount, ""],
    [],
    ["Category Distribution"],
    ["Category", "Count", "Percentage"],
    ...categoryCounts.map(cat => [cat.name, cat.count, cat.percent]),
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

  // Detailed Task Data
  const detailedData = tasks.map(t => ({
    Title: t.title,
    Description: t.description || "",
    Status: t.status,
    Category: categoryMap[t.categoryId] || "Unknown",
    DueDate: t.dueDate,
    CreatedAt: t.createdAt,
  }));
  const detailedSheet = XLSX.utils.json_to_sheet(detailedData);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");
  XLSX.utils.book_append_sheet(wb, detailedSheet, "Detailed Tasks");

  const filename = `AnalyticsExport_${new Date().toISOString().slice(0, 10)}.xlsx`;
  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], { type: "application/octet-stream" });

  saveAs(blob, filename);
};
