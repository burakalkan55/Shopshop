import React from "react";
import { Box, Typography, Button, Container, Stack } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom right, #f0f4ff, #ffffff)",
        minHeight: "100vh",
        py: 10,
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <StorefrontIcon sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Welcome to ShopShop!
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          Discover your favorite products and start shopping effortlessly.
        </Typography>

        <Stack spacing={2} direction={{ xs: "column", sm: "row" }} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ShoppingCartIcon />}
            component={Link}
            to="/products"
          >
            Start Shopping
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={Link}
            to="/profile"
          >
            Go to Profile
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;
