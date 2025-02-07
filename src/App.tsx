import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import Home from "./pages/Home";
import { isAuthenticated } from "./utils/lib";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token || !isAuthenticated(token)) {
    return <Navigate to="/login" />;
  }

  return children;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (token && isAuthenticated(token)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
