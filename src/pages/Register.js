// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Typography,
//   Box,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import api from "../api/api";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Link } from "react-router-dom";

// const Register = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState({ username: "", password: "", name: "" });
//   const [error, setError] = useState("");
//   const [validationErrors, setValidationErrors] = useState({});

//   const validateForm = () => {
//     let errors = {};
//     if (!user.name.trim()) errors.name = "Full Name is required";
//     if (!user.username.trim()) {
//       errors.username = "Username is required";
//     } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(user.username)) {
//       errors.username = "Enter a valid email address";
//     }
//     if (!user.password) {
//       errors.password = "Password is required";
//     } else if (user.password.length < 8) {
//       errors.password = "Password must be at least 8 characters";
//     }
//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };

//   const handleRegister = async () => {
//     if (!validateForm()) return;
//     try {
//       await api.post("/api/auth/register", user);
//       navigate("/login");
//     } catch (err) {
//       setError("Registration failed. Try again.");
//     }
//   };

//   return (
//     <Box
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       minHeight="100vh"
//       sx={{ position: "relative", overflow: "hidden" }}
//     >
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           zIndex: 1,
//         }}
//       ></div>
//       <div
//         className="container text-white position-relative"
//         style={{ zIndex: 2 }}
//       >
//         <div className="row justify-content-center align-items-center">
//           <div className="col-md-4 mb-4">
//             <Card
//               sx={{
//                 width: "100%",
//                 padding: 3,
//                 boxShadow: 4,
//                 borderRadius: 2,
//                 backgroundColor: "rgba(255, 255, 255, 0.9)",
//               }}
//             >
//               <CardContent>
//                 <Typography
//                   variant="h5"
//                   align="center"
//                   gutterBottom
//                   className="fw-bold"
//                   sx={{ color: "#333" }}
//                 >
//                   Register
//                 </Typography>
//                 {error && (
//                   <Typography color="error" align="center">
//                     {error}
//                   </Typography>
//                 )}
//                 <TextField
//                   fullWidth
//                   label="Full Name"
//                   variant="outlined"
//                   name="name"
//                   value={user.name}
//                   onChange={handleChange}
//                   margin="normal"
//                   error={!!validationErrors.name}
//                   helperText={validationErrors.name}
//                 />
//                 <TextField
//                   fullWidth
//                   label="Username"
//                   variant="outlined"
//                   name="username"
//                   value={user.username}
//                   onChange={handleChange}
//                   margin="normal"
//                   error={!!validationErrors.username}
//                   helperText={validationErrors.username}
//                 />
//                 <TextField
//                   fullWidth
//                   label="Password"
//                   variant="outlined"
//                   type="password"
//                   name="password"
//                   value={user.password}
//                   onChange={handleChange}
//                   margin="normal"
//                   error={!!validationErrors.password}
//                   helperText={validationErrors.password}
//                 />
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   color="primary"
//                   onClick={handleRegister}
//                   sx={{ marginTop: 2 }}
//                 >
//                   Register
//                 </Button>
//                 <Typography align="center" sx={{ marginTop: 2 }}>
//                   Already have an account?{" "}
//                   <Button
//                     onClick={() => navigate("/login")}
//                     sx={{ textTransform: "none" }}
//                   >
//                     Login
//                   </Button>
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   align="center"
//                   className="mt-3 text-muted"
//                 >
//                   By signing up, you agree to our{" "}
//                   <Link to="/terms-of-service">Terms of Service </Link>
//                   and <Link to="/privacy-policy">Privacy Policy</Link>.
//                 </Typography>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </Box>
//   );
// };

// export default Register;

import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
    name: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [alert, setAlert] = useState({
    visible: false,
    message: "",
    color: "info",
  });

  useEffect(() => {
    if (alert.visible) {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.visible]);

  const validateForm = () => {
    let errors = {};
    if (!user.name.trim()) errors.name = "Full Name is required";
    if (!user.username.trim()) {
      errors.username = "Username is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(user.username)) {
      errors.username = "Enter a valid email address";
    }
    if (!user.password) {
      errors.password = "Password is required";
    } else if (user.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!user.role) {
      errors.role = "Please select a role";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    try {
      await api.post("/api/auth/register", user);
      setAlert({
        visible: true,
        message: "Registered successfully!, Redirecting to login...",
        color: "success",
      });
      setTimeout(() => navigate("/login"), 1500); // slight delay for user to see Snackbar
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        position: "relative",
        background: "radial-gradient(circle at top, #7b0000, #2c0000 70%)",
        overflow: "hidden",
        px: 2,
      }}
    >
      {/* Decorative gold particles */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url('https://pngimg.com/d/gold_PNG10981.png')`,
          opacity: 0.09,
          zIndex: 1,
        }}
      ></Box>

      <Box
        className="container position-relative"
        sx={{ zIndex: 2, color: "#fff" }}
      >
        <div className="row justify-content-center align-items-center">
          <div className="col-md-5 mb-4">
            <Card
              sx={{
                width: "100%",
                p: 3,
                borderRadius: 3,
                boxShadow: "0 0 30px rgba(255,215,0,0.3)",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.97), rgba(255,241,224,0.9))",
              }}
            >
              <CardContent>
                <Typography
                  variant="h4"
                  align="center"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "#8B0000",
                    textShadow: "0 1px 1px gold",
                  }}
                >
                  Register Now
                </Typography>
                {error && (
                  <Typography color="error" align="center">
                    {error}
                  </Typography>
                )}
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  margin="normal"
                  error={!!validationErrors.name}
                  helperText={validationErrors.name}
                />
                <TextField
                  fullWidth
                  label="Username (Gmail only)"
                  variant="outlined"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  margin="normal"
                  error={!!validationErrors.username}
                  helperText={validationErrors.username}
                />
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  margin="normal"
                  error={!!validationErrors.password}
                  helperText={validationErrors.password}
                />
                <TextField
                  select
                  fullWidth
                  label="Select Role"
                  variant="outlined"
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                  margin="normal"
                  error={!!validationErrors.role}
                  helperText={validationErrors.role}
                >
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </TextField>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleRegister}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    fontWeight: "bold",
                    backgroundColor: "#b30000",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#990000",
                    },
                  }}
                >
                  Register
                </Button>

                <Typography align="center" sx={{ mt: 2 }}>
                  Already have an account?{" "}
                  <Button
                    onClick={() => navigate("/login")}
                    sx={{ textTransform: "none", color: "#b30000" }}
                  >
                    Login
                  </Button>
                </Typography>

                <Typography
                  variant="body2"
                  align="center"
                  sx={{ mt: 3, color: "#555" }}
                >
                  By signing up, you agree to our{" "}
                  <Link to="/terms-of-service">Terms of Service</Link> and{" "}
                  <Link to="/privacy-policy">Privacy Policy</Link>.
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </Box>
      <Snackbar
        open={alert.visible}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, visible: false })}
      >
        <Alert severity={alert.color} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
