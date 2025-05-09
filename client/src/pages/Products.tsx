import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  Typography,
  Button,
  Snackbar,
  Pagination,
  Box,
} from "@mui/material";
import axios from "axios";
import { useShopStore } from "../store/shopStore";
import Loading from "../components/Loading";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { favorites, toggleFavorite, setFavorites } = useShopStore();
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/products?limit=100");
        setProducts(response.data.products);
        localStorage.setItem("cachedProducts", JSON.stringify(response.data.products));
      } catch (err) {
        setMessage("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
  
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const res = await axios.get("http://localhost:3000/favs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const favIds = res.data.map((fav: any) => fav.productId);
        setFavorites(favIds);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };
  
    fetchProducts();
    fetchFavorites();
  }, [setFavorites]);
  

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = async (productId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/cart",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Added to cart.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to add to cart.");
    }
  };

  const handleToggleFavorite = async (productId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login to use favorites.");
      return;
    }

    try {
      if (favorites.includes(productId)) {
        await axios.delete(`http://localhost:3000/favs/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toggleFavorite(productId);
        setMessage("Removed from favorites.");
      } else {
        await axios.post(
          "http://localhost:3000/favs",
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toggleFavorite(productId);
        setMessage("Added to favorites.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Favorite action failed.");
    }
  };

  if (loading) return <Loading message="Fetching products..." />;

  return (
    <Box sx={{ padding: 4 }}>
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
        {paginatedProducts.map((product) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={product.id}
            sx={{
              maxWidth: "300px",
              minWidth: "280px",
              flex: "0 0 auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Card
              sx={{
                height: 380,
                width: "100%",
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
                    whiteSpace: "normal",
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
                  variant={favorites.includes(product.id) ? "contained" : "outlined"}
                  color="error"
                  sx={{ 
                    minWidth: 40, 
                    height: 40,
                    backgroundColor: favorites.includes(product.id) ? "#f44336" : "transparent",
                    color: favorites.includes(product.id) ? "white" : "#f44336",
                    "&:hover": {
                      backgroundColor: favorites.includes(product.id) ? "#d32f2f" : "rgba(244, 67, 54, 0.04)",
                    }
                  }}
                  onClick={() => handleToggleFavorite(product.id)}
                >
                  {favorites.includes(product.id) ? "❤️" : "🤍"}
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

      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Pagination
          count={Math.ceil(products.length / itemsPerPage)}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="primary"
          shape="rounded"
          size="large"
        />
      </Box>

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={message}
      />
    </Box>
  );
};

export default Products;