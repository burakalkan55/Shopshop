import React from "react";
import { Box, Typography, Container } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: 10,
        backgroundColor: "#f1f5f9",
        borderTop: "1px solid #e2e8f0",
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} ShopShop. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
