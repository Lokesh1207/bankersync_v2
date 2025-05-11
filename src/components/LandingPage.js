import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Row, Col } from "reactstrap";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { FaMoneyCheckAlt, FaUsers, FaTools, FaCoins } from "react-icons/fa";
import {
  MdOutlineCalculate,
  MdOutlinePerson,
  MdOutlinePictureAsPdf,
  MdDashboardCustomize,
} from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";

const LandingPage = () => {
  const navigate = useNavigate();
  const [goldRate, setGoldRate] = useState(null);
  const [goldRate22K, setGoldRate22K] = useState(null);
  const [is24K, setIs24K] = useState(true); // Default is 24K

  useEffect(() => {
    const fetchGoldRate = async () => {
      try {
        const response = await axios.get("https://www.goldapi.io/api/XAU/INR", {
          headers: {
            "x-access-token": process.env.REACT_APP_GOLD_API_KEY,
            "Content-Type": "application/json",
          },
        });

        const pricePerOunce = response.data.price; // in INR per troy ounce
        const pricePerGram = pricePerOunce / 31.1035; // convert to per gram
        setGoldRate(pricePerGram.toFixed(2)); // round to 2 decimals

        const pricePerGram22K = (pricePerGram * 0.9167).toFixed(2); // 22K rate is typically 91.67% of 24K
        setGoldRate22K(pricePerGram22K); // set the 22K rate
      } catch (error) {
        console.error("Failed to fetch gold rate:", error.message);
      }
    };

    fetchGoldRate();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(to right, #8B0000, #B22222)",
          color: "white",
          minHeight: "100vh",
          py: 6,
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating gold coins */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: Math.random() * 800, opacity: 0 }}
            animate={{
              y: [Math.random() * 800, -100],
              opacity: [0.2, 0.6, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: i,
            }}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              fontSize: "1.5rem",
              color: "gold",
              zIndex: 0,
            }}
          >
            <FaCoins />
          </motion.div>
        ))}

        <Container
          className="text-center"
          style={{ position: "relative", zIndex: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              style={{
                fontSize: "3.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                background: "linear-gradient(90deg, #FFD700, #FF8C00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "goldPulse 3s infinite alternate",
              }}
            >
              Banker Sync
            </motion.h1>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Automate your gold loan & customer management with ease.
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
                mb: 4,
                flexWrap: "wrap",
              }}
            >
              <Feature
                icon={<FaMoneyCheckAlt size={40} />}
                title="Loan Management"
              />
              <Feature icon={<FaUsers size={40} />} title="Client Management" />
              <Feature
                icon={<FaTools size={40} />}
                title="End-to-End Dashboard"
              />
            </Box>

            <Button
              color="light"
              size="lg"
              onClick={() => navigate("/register")}
            >
              Get Started
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 8, backgroundColor: "#fff", textAlign: "center" }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
            How It Works
          </Typography>
          <Row>
            <Col md={4}>
              <Step number="1" title="Enter Customer & Gold Info" />
            </Col>
            <Col md={4}>
              <Step number="2" title="Loan Value Calculated Instantly" />
            </Col>
            <Col md={4}>
              <Step number="3" title="Track, Notify & Export PDF" />
            </Col>
          </Row>
        </Container>
      </Box>

      {/* Key Modules Section */}
      <Box
        sx={{
          py: 8,
          background: "linear-gradient(to right, #B22222, #8B0000)",
          color: "white",
          textAlign: "center",
        }}
      >
        <Container>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
            Key Modules
          </Typography>
          <Row>
            <Col md={3}>
              <Module
                icon={<MdOutlinePerson size={30} />}
                title="Client Entry"
              />
            </Col>
            <Col md={3}>
              <Module
                icon={<MdOutlineCalculate size={30} />}
                title="Loan Calculation"
              />
            </Col>
            <Col md={3}>
              <Module
                icon={<MdDashboardCustomize size={30} />}
                title="Smart Dashboard"
              />
            </Col>
            <Col md={3}>
              <Module
                icon={<MdOutlinePictureAsPdf size={30} />}
                title="PDF Generation"
              />
            </Col>
          </Row>
        </Container>
      </Box>

      {/* Live Gold Rate Section */}
      <Box
        sx={{
          py: 6,
          background: "linear-gradient(to right, #fff8dc, #fffaf0)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating gold coins for a touch of luxury */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: Math.random() * 400, opacity: 0 }}
            animate={{
              y: [Math.random() * 400, -50],
              opacity: [0.2, 0.6, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 5,
              repeat: Infinity,
              delay: i,
            }}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              fontSize: "1.3rem",
              color: "gold",
              zIndex: 0,
            }}
          >
            <FaCoins />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#8B0000",
              mb: 3,
              fontSize: "1.7rem",
            }}
          >
            {goldRate ? (
              <>
                Today's{" "}
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{
                    color: "#FFD700",
                    fontWeight: 600,
                    textShadow: "0 0 8px gold",
                  }}
                >
                  {is24K ? "24K" : "22K"}
                </motion.span>{" "}
                Gold Rate: ₹{is24K ? goldRate : goldRate22K} / gram
              </>
            ) : (
              "Fetching today's gold rate..."
            )}
          </Typography>

          <motion.div
            whileTap={{ scale: 0.9 }}
            style={{ display: "inline-block" }}
          >
            <Button
              onClick={() => setIs24K(!is24K)}
              sx={{
                background: "linear-gradient(to right, #FFD700, #FFA500)",
                color: "#fff",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                borderRadius: "30px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                textTransform: "none",
                fontSize: "1rem",
                transition: "0.3s",
                "&:hover": {
                  background: "linear-gradient(to right, #FFA500, #FFD700)",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
                },
              }}
            >
              Switch to {is24K ? "22K" : "24K"} Rate
            </Button>
          </motion.div>

          <Typography
            variant="body2"
            sx={{ color: "#444", mt: 3, fontStyle: "italic" }}
          >
            *Rates are updated daily and may vary. Please verify before
            processing transactions.
          </Typography>
        </motion.div>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ py: 8, backgroundColor: "#f9f9f9", textAlign: "center" }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
            Why us ?
          </Typography>
          <Row>
            <Col md={4}>
              <motion.div whileHover={{ scale: 1.05 }} style={benefitBox}>
                <Typography variant="h6">Reduce Manual Errors</Typography>
                <Typography variant="body2">
                  Auto-calculation ensures zero mistakes.
                </Typography>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div whileHover={{ scale: 1.05 }} style={benefitBox}>
                <Typography variant="h6">Fast PDF Export</Typography>
                <Typography variant="body2">
                  Share accurate receipts instantly.
                </Typography>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div whileHover={{ scale: 1.05 }} style={benefitBox}>
                <Typography variant="h6">Smart Notifications</Typography>
                <Typography variant="body2">
                  Get reminded when loans mature.
                </Typography>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </Box>

      {/* Callout Strip */}
      <Box
        sx={{
          py: 4,
          backgroundColor: "#B22222",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Go 100% Digital. Save Time. Reduce Paperwork.
        </Typography>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: "#f5f5f5", // Light grey to stand out from white
          color: "#555",
          py: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Banker Sync. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

// Reusable components
const Feature = ({ icon, title }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
    style={{
      textAlign: "center",
      padding: "1rem",
      minWidth: 150,
    }}
  >
    <div style={{ marginBottom: "0.5rem" }}>{icon}</div>
    <Typography variant="subtitle1">{title}</Typography>
  </motion.div>
);

const Step = ({ number, title }) => (
  <motion.div whileHover={{ scale: 1.05 }} style={{ padding: "1rem" }}>
    <Typography variant="h3" sx={{ color: "#B22222", fontWeight: "bold" }}>
      {number}
    </Typography>
    <Typography variant="h6">{title}</Typography>
  </motion.div>
);

const Module = ({ icon, title }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    style={{
      padding: "1.5rem",
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "10px",
      margin: "0.5rem",
    }}
  >
    <div style={{ marginBottom: "1rem" }}>{icon}</div>
    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
      {title}
    </Typography>
  </motion.div>
);

const benefitBox = {
  background: "white",
  padding: "1.5rem",
  borderRadius: "10px",
  margin: "1rem",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
};

export default LandingPage;
