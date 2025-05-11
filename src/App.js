import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProtectedRoute from "./components/ProtectedRoute";
import SideNav from "./components/SideNav";
import AddClient from "./pages/AddClient";
import ManageClients from "./pages/ManageClients";
import AddLoan from "./pages/AddLoan";
import ManageLoans from "./pages/ManageLoans";
import LandingPage from "./components/LandingPage";
import User from "./pages/User";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

function App() {
  const token = localStorage.getItem("authToken");
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              token ? <Navigate to="/home" /> : <Navigate to="/landing" />
            }
          />
          {/* Public Routes */}
          {/* <Route path="/landing" element={<LandingPage />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/landing" element={<LandingPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/user" element={<User />} />
            <Route element={<SideNav />}>
              <Route path="/home" element={<Home />} />
              <Route path="/client" element={<AddClient />} />
              <Route path="/clients/manage" element={<ManageClients />} />
              {/* Add other routes you want inside SideNav layout */}
              <Route path="/loan" element={<AddLoan />} />{" "}
              {/* Add Loan Route */}
              <Route path="/loans/manage" element={<ManageLoans />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
