// import React, { useState } from 'react';
// import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/api';

// const Login = () => {
//   const navigate = useNavigate();
//   const [credentials, setCredentials] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async () => {
//     try {
//       const response = await api.post('/api/auth/login', credentials);
//       localStorage.setItem('authToken', response.data.token); // Store JWT token
//       navigate('/home'); // Redirect to home
//     } catch (err) {
//       setError('Invalid credentials. Try again.');
//     }
//   };

//   return (
//     <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
//       <Card sx={{ width: 350, padding: 3, boxShadow: 3 }}>
//         <CardContent>
//           <Typography variant="h5" align="center" gutterBottom>
//             Login
//           </Typography>

//           {error && (
//             <Typography color="error" align="center">
//               {error}
//             </Typography>
//           )}

//           <TextField
//             fullWidth
//             label="Username"
//             variant="outlined"
//             name="username"
//             value={credentials.username}
//             onChange={handleChange}
//             margin="normal"
//           />

//           <TextField
//             fullWidth
//             label="Password"
//             variant="outlined"
//             type="password"
//             name="password"
//             value={credentials.password}
//             onChange={handleChange}
//             margin="normal"
//           />

//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             onClick={handleLogin}
//             sx={{ marginTop: 2 }}
//           >
//             Login
//           </Button>

//           <Typography align="center" sx={{ marginTop: 2 }}>
//             Don't have an account?{' '}
//             <Button onClick={() => navigate('/register')} sx={{ textTransform: 'none' }}>
//               Register
//             </Button>
//           </Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default Login;

import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/api";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      // Step 1: Send login request and get the token
      const response = await api.post("/api/auth/login", credentials);
      const token = response.data.token;
      localStorage.setItem("authToken", token);

      // Step 2: Set token in default headers for subsequent requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Step 3: Fetch the role of the current user
      const roleResponse = await api.get("/api/auth/getRole");
      const role = roleResponse.data.data; // Assuming the role is in the 'data' field of the response

      // Step 4: Redirect based on role
      if (role === "ADMIN") {
        navigate("/home"); // Redirect to home for admin
      } else {
        navigate("/user"); // Redirect to user page for regular user
      }
    } catch (err) {
      setError("Invalid credentials. Try again.");
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
          backgroundRepeat: "repeat",
          backgroundSize: "contain",
          opacity: 0.05,
          zIndex: 1,
        }}
      ></Box>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ zIndex: 2, width: "100%", maxWidth: 420 }}
      >
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
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
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
                Login
              </Typography>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Typography color="error" align="center">
                  {error}
                </Typography>
              </motion.div>
            )}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                margin="normal"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                margin="normal"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={handleLogin}
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
                Login
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Typography align="center" sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Button
                  onClick={() => navigate("/register")}
                  sx={{ textTransform: "none", color: "#b30000" }}
                >
                  Register
                </Button>
              </Typography>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Login;
