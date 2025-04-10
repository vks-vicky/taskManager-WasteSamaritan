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
      setDueDate(initialData.dueDate.split("T")[0]); // For input[type=date]
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      status,
      categoryId,
      tagIds,
      dueDate,
      createdAt: initialData?.createdAt || new Date().toISOString()
    };

    onSubmit(payload);
  };

  const toggleTag = (tagId: string) => {
    setTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setDescription(e.target.value)
        }
      />

      <select
        value={status}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setStatus(e.target.value as TaskStatus)
        }
      >
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        value={categoryId}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setCategoryId(e.target.value)
        }
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div>
        {tags.map((tag) => (
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setDueDate(e.target.value)
        }
        required
      />

      <button type="submit">{initialData ? "Update Task" : "Create Task"}</button>
    </form>
  );
};

export default TaskForm;
