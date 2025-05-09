import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const Loading: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        minHeight: "40vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={50} thickness={5} />
      <Typography variant="body1" sx={{ color: "text.secondary" }}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
