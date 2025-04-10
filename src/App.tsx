import { Routes, Route, NavLink } from 'react-router-dom';
import TaskDashboard from './pages/TaskDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

function App() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
        <NavLink to="/">Tasks</NavLink>
        <NavLink to="/analytics">Analytics</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<TaskDashboard />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
      </Routes>
    </div>
  );
}

export default App;