import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

interface CartItem {
  id: number;
  quantity: number;
  product: {
    title: string;
    price: number;
    image: string;
  };
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:3000/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data);
    } catch (err) {
      console.error(err);
      setError("Sepet alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        🛒 Sepetim
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {loading ? (
        <Typography>Yükleniyor...</Typography>
      ) : cartItems.length === 0 ? (
        <Typography>Sepetiniz boş.</Typography>
      ) : (
        <>
          {cartItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  style={{ width: 60, height: 60, objectFit: "contain" }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    {item.product.title}
                  </Typography>
                  <Typography variant="body2">
                    ${item.product.price} x {item.quantity}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <IconButton>
                  <AddIcon />
                </IconButton>
                <IconButton>
                  <RemoveIcon />
                </IconButton>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Box>
          ))}

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6">Toplam: ${total.toFixed(2)}</Typography>
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            ✅ Satın Al
          </Button>
        </>
      )}
    </Box>
  );
};

export default Cart;
