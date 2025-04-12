import React from "react";
import TagManager from "../components/Tag/TagManager";
import CategoryManager from "../components/Category/CategoryManager";

const ManageMetadata: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Manage Categories & Tags</h2>
      <CategoryManager />
      <TagManager />
    </div>
  );
};

export default ManageMetadata;
