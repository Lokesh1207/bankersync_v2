// components/GoldRateBanner.js
import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { FaCoins } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const GoldRateBanner = () => {
  const [goldRate, setGoldRate] = useState(null);
  const [goldRate22K, setGoldRate22K] = useState(null);
  const [is24K, setIs24K] = useState(true);

  useEffect(() => {
    const fetchGoldRate = async () => {
      try {
        const response = await axios.get("https://www.goldapi.io/api/XAU/INR", {
          headers: {
            "x-access-token": process.env.REACT_APP_GOLD_API_KEY,
            "Content-Type": "application/json",
          },
        });

        const pricePerOunce = response.data.price;
        const pricePerGram = pricePerOunce / 31.1035;
        setGoldRate(pricePerGram.toFixed(2));
        setGoldRate22K((pricePerGram * 0.9167).toFixed(2));
      } catch (error) {
        console.error("Failed to fetch gold rate:", error.message);
      }
    };

    fetchGoldRate();
  }, []);

  return (
    <Box
      sx={{
        py: 6,
        background: "linear-gradient(to right, #fff8dc, #fffaf0)",
        textAlign: "center",
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        mb: 4,
      }}
    >
      {/* Floating coins animation */}
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

        <motion.div whileTap={{ scale: 0.9 }} style={{ display: "inline-block" }}>
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
          *Rates are updated daily and may vary.
        </Typography>
      </motion.div>
    </Box>
  );
};

export default GoldRateBanner;
