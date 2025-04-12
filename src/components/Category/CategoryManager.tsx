import React, { useState, useEffect } from "react";
import { Category } from "../../types/models";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../../firebase/categoryService";

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#0000ff");

  useEffect(() => {
    getAllCategories().then(setCategories);
  }, []);

  const handleAddCategory = async () => {
    if (!name.trim()) return;

    const newCat = await createCategory({ name, color });
    setCategories((prev) => [...prev, newCat]);
    setName("");
    setColor("#0000ff");
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h4>Manage Categories</h4>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                backgroundColor: cat.color,
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
              }}
            >
              {cat.name}
            </span>
            <button onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
