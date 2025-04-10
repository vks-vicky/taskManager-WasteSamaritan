import { Routes, Route, NavLink } from "react-router-dom";
import TaskDashboard from "./pages/TaskDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ManageMetadata from "./pages/ManageMetadata";

function App() {
  return (
    <div>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <NavLink to="/">Tasks</NavLink>
        <NavLink to="/analytics">Analytics</NavLink>
        <NavLink to="/manage">Manage Tags & Categories</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<TaskDashboard />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/manage" element={<ManageMetadata />} />
      </Routes>
    </div>
  );
}

export default App;
