import React, { useEffect, useState } from "react";
import { Grid } from '@mui/material';
import { useShopStore } from "../store/shopStore";



import {
 
  Card,
  CardMedia,
  Typography,
  Button,
  Box,
  Snackbar,
} from "@mui/material";
import axios from "axios";

import Loading from "../components/Loading";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

const Fav: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const { toggleFavorite, addToCart } = useShopStore();

  

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please login to view favorites");
        setLoading(false);
        return;
      }

      try {
        // Fetch favorite product IDs
        const favResponse = await axios.get("http://localhost:3000/favs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Get cached products from localStorage
        const cachedProducts = JSON.parse(localStorage.getItem("cachedProducts") || "[]");
        
        // Filter products to show only favorites
        const favoriteProducts = cachedProducts.filter((product: Product) =>
          favResponse.data.some((fav: any) => fav.productId === product.id)
        );
        
        setProducts(favoriteProducts);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load favorite products");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, []);

  const handleRemoveFavorite = async (productId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`http://localhost:3000/favs/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toggleFavorite(productId);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      setMessage("Removed from favorites");
    } catch (err) {
      console.error(err);
      setMessage("Failed to remove from favorites");
    }
  };

  const handleAddToCart = async (productId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login first");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/cart",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToCart(productId);
      setMessage("Added to cart");
    } catch (err) {
      console.error(err);
      setMessage("Failed to add to cart");
    }
  };

  if (loading) return <Loading message="Loading favorites..." />;

  if (products.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Typography variant="h5">No favorite products found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        My Favorites
      </Typography>
      <Grid
        container
        spacing={4}
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          margin: "0 auto",
          maxWidth: "1400px",
        }}
      >
        {products.map((product) => (
          <Grid
            
            
          >
            <Card
              sx={{
                height: "380px",   // Tırnak işareti eklendi
                width: "100%",     // Tırnak işareti eklendi
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                borderRadius: 2,
                boxShadow: 3,
                overflow: "hidden",
                textAlign: "center",
                p: 1.5,
                backgroundColor: "#fff",
                transition: "0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardMedia
                component="img"
                image={product.thumbnail}
                alt={product.title}
                sx={{
                  width: 160,
                  height: 160,
                  objectFit: "contain",
                  borderRadius: 1,
                  mb: 2,
                }}
              />

              <Box sx={{ height: 80, overflow: "hidden", width: "100%" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    lineHeight: 1.2,
                    mb: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {product.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontSize: "1rem", fontWeight: "bold" }}
                >
                  ${product.price.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  sx={{ minWidth: 40, height: 40 }}
                  onClick={() => handleRemoveFavorite(product.id)}
                >
                  ❤️
                </Button>
                <Button
                  variant="contained"
                  sx={{ minWidth: 40, height: 40 }}
                  onClick={() => handleAddToCart(product.id)}
                >
                  🛒
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={message}
      />
    </Box>
  );
};

export default Fav;