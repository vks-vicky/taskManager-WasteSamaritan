import React, { useState, useEffect } from "react";
import { Category, Tag, TaskStatus } from "../../types/models";

interface Filters {
  status?: TaskStatus;
  categoryId?: string;
  tagIds: string[];
  searchQuery: string;
}

interface Props {
  categories: Category[];
  tags: Tag[];
  onChange: (filters: Filters) => void;
}

const FilterPanel: React.FC<Props> = ({ categories, tags, onChange }) => {
  const [status, setStatus] = useState<TaskStatus | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    onChange({ status, categoryId, tagIds, searchQuery });
  }, [status, categoryId, tagIds, searchQuery]);

  const handleClearFilters = () => {
    setStatus(undefined);
    setCategoryId(undefined);
    setTagIds([]);
    setSearchQuery("");
  };

  const toggleTag = (id: string) => {
    setTagIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <strong>Status:</strong><br />
        {["todo", "in-progress", "done"].map((s) => (
          <label key={s} style={{ marginRight: "1rem" }}>
            <input
              type="radio"
              name="status"
              value={s}
              checked={status === s}
              onChange={() => setStatus(s as TaskStatus)}
            />
            {s}
          </label>
        ))}
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            name="status"
            value=""
            checked={!status}
            onChange={() => setStatus(undefined)}
          />
          All
        </label>
      </div>

      <div>
        <strong>Category:</strong><br />
        <select value={categoryId || ""} onChange={e => setCategoryId(e.target.value || undefined)}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <strong>Tags:</strong><br />
        {tags.map(tag => (
          <label key={tag.id} style={{ marginRight: "1rem" }}>
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

      <div>
        <input
          type="text"
          placeholder="Search title or description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <button onClick={handleClearFilters}>Clear All Filters</button>
    </div>
  );
};

export default FilterPanel;
