
import React, { useState } from "react";
import { TaskStatus, Category, Tag } from "../../types/models";

interface Props {
  onSubmit: (data: any) => void;
  categories: Category[];
  tags: Tag[];
}

const TaskForm: React.FC<Props> = ({ onSubmit, categories, tags }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const createdAt = new Date().toISOString();
    onSubmit({ title, description, status, categoryId, tagIds, dueDate, createdAt });
  };

  const toggleTag = (tagId: string) => {
    setTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div>
        {tags.map(tag => (
          <label key={tag.id} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              value={tag.id}
              checked={tagIds.includes(tag.id)}
              onChange={() => toggleTag(tag.id)}
            />
            {tag.name}
          </label>
        ))}
      </div>

      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        required
      />

      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;
