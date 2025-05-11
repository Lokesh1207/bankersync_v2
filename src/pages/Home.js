// Dependencies (ensure installed):
// npm install @mui/material @mui/icons-material @emotion/react @emotion/styled recharts framer-motion

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
  useTheme,
  Chip,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Group, CurrencyRupee, TrendingUp } from "@mui/icons-material";
import api from "../api/api";
import GoldRateBanner from "../components/GoldRateBanner";

const COLORS = ["#3f51b5", "#009688", "#f44336", "#FF9800", "#4CAF50"];
const MotionPaper = motion(Paper);

// Greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning 🌅";
  if (hour < 18) return "Good Afternoon ☀️";
  return "Good Evening 🌙";
};

// Modern InfoCard
const InfoCard = ({ title, value, icon, color, chipLabel }) => (
  <MotionPaper
    whileHover={{ scale: 1.01 }}
    transition={{ type: "spring", stiffness: 250 }}
    elevation={2}
    sx={{
      p: 2,
      borderRadius: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "100%",
      background: "#fff",
      boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    }}
  >
    <Box display="flex" alignItems="center" gap={1.5}>
      <Avatar sx={{ bgcolor: color, width: 44, height: 44 }}>{icon}</Avatar>
      <Box>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          fontWeight={500}
          lineHeight={1.2}
        >
          {title}
        </Typography>
        <Typography
          variant="h6"
          color="text.primary"
          fontWeight="bold"
          lineHeight={1.4}
        >
          {value}
        </Typography>
      </Box>
    </Box>

    {chipLabel && (
      <Chip
        label={chipLabel}
        size="small"
        color="primary"
        variant="outlined"
        sx={{ ml: 1 }}
      />
    )}
  </MotionPaper>
);

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Admin");
  const theme = useTheme();

  useEffect(() => {
    api
      .get("/api/admin/dashboard")
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    api
      .get("/api/admin/getName")
      .then((res) => setUserName(res.data.data))
      .catch(() => setUserName("Admin"));
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  const {
    loanSummary,
    clientSummary,
    financeSummary,
    topClients,
    monthlyLoanStats,
    upcomingReturns,
  } = data;

  const pieData = Object.entries(loanSummary).map(([name, value]) => ({
    name,
    value,
  }));
  const barData = Object.entries(monthlyLoanStats).map(([month, count]) => ({
    month,
    count,
  }));

  return (
    <Box p={3}>
      {/* Greeting Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box mb={4}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            sx={{ mb: 1 }}
          >
            {getGreeting()}, {userName}!
          </Typography>
        </Box>
      </motion.div>

      {/* Gold Rate Carousel Section */}
      <GoldRateBanner />

      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard
            title="Total Clients"
            value={clientSummary.totalClients}
            icon={<Group />}
            color="#3f51b5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard
            title="Total Loans"
            value={loanSummary.totalLoans}
            icon={<TrendingUp />}
            color="#009688"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard
            title="Loaned Amount"
            value={`₹${financeSummary.totalLoanedAmount.toLocaleString()}`}
            icon={<CurrencyRupee />}
            color="#f44336"
          />
        </Grid>

        {/* Loan Status Pie Chart */}
        <Grid item xs={12} md={6}>
          <MotionPaper
            elevation={3}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ p: 3, borderRadius: 3 }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Loan Status Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <RechartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </MotionPaper>
        </Grid>

        {/* Monthly Loans Bar Chart */}
        <Grid item xs={12} md={6}>
          <MotionPaper
            elevation={3}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{ p: 3, borderRadius: 3 }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Monthly Loan Stats
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartTooltip />
                <Legend />
                <Bar dataKey="count" fill="#1976d2" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </MotionPaper>
        </Grid>

        {/* Top Clients */}
        <Grid item xs={12} md={6}>
          <MotionPaper
            elevation={3}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            sx={{ p: 3, borderRadius: 3 }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Top Clients by Loan Value
            </Typography>
            {topClients.map((client, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                py={1}
                borderBottom="1px dashed #eee"
              >
                <Typography>{client.clientName}</Typography>
                <Typography fontWeight="bold" color="primary">
                  ₹{client.totalLoanValue.toLocaleString()}
                </Typography>
              </Box>
            ))}
          </MotionPaper>
        </Grid>

        {/* Upcoming Returns */}
        <Grid item xs={12} md={6}>
          <MotionPaper
            elevation={3}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            sx={{ p: 3, borderRadius: 3 }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Upcoming Loan Returns (Next 7 Days)
            </Typography>
            {upcomingReturns.length === 0 ? (
              <Typography color="text.secondary">
                No upcoming returns.
              </Typography>
            ) : (
              upcomingReturns.map((item, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent="space-between"
                  py={1}
                  borderBottom="1px dashed #eee"
                >
                  <Typography>{item.clientName}</Typography>
                  <Typography>
                    {new Date(item.returnDate).toLocaleDateString()}
                  </Typography>
                </Box>
              ))
            )}
          </MotionPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
