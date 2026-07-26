import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import InterviewPrepPage from "./pages/InterviewPrepPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import ResumeBuilder from "./pages/ResumeBuilder";


function App() {
  return (
    <Routes>
      <Route
        path="/resume-builder"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ResumeBuilder />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AnalyticsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/interview-prep"
        element={
          <ProtectedRoute>
            <MainLayout>
              <InterviewPrepPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
