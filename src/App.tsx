import { Routes, Route } from "react-router-dom";
import TaskDashboard from "./pages/TaskDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ManageMetadata from "./pages/ManageMetadata";
import Layout from "./components/Shared/Layout";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <TaskDashboard />
          </Layout>
        }
      />
      <Route
        path="/analytics"
        element={
          <Layout>
            <AnalyticsDashboard />
          </Layout>
        }
      />
      <Route
        path="/manage"
        element={
          <Layout>
            <ManageMetadata />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
