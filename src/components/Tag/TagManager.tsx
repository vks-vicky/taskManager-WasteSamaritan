import React, { useState, useEffect } from "react";
import { Tag } from "../../types/models";
import { createTag, deleteTag, getAllTags } from "../../firebase/tagService";

const TagManager: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ff0000");

  useEffect(() => {
    getAllTags().then(setTags);
  }, []);

  const handleAddTag = async () => {
    if (!name.trim()) return;

    const newTag = await createTag({ name, color });
    setTags(prev => [...prev, newTag]);
    setName("");
    setColor("#ff0000");
  };

  const handleDeleteTag = async (id: string) => {
    await deleteTag(id);
    setTags(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h4>Manage Tags</h4>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Tag name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
        />
        <button onClick={handleAddTag}>Add Tag</button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {tags.map(tag => (
          <div key={tag.id} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <span style={{ backgroundColor: tag.color, padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
              {tag.name}
            </span>
            <button onClick={() => handleDeleteTag(tag.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagManager;
