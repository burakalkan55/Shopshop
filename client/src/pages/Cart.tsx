import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Stack,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
  };
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState<string>("");
  const token = localStorage.getItem("token");

  // Scroll sabitliği ve cart'ı çekme
  useEffect(() => {
    fetchCart();
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:3000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data);
    } catch {
      setMessage("Sepet alınamadı.");
    }
  };

  const updateCart = async (productId: number, amount: number) => {
    const scrollY = window.scrollY;
    try {
      await axios.post(
        "http://localhost:3000/cart",
        { productId, quantity: amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
      setTimeout(() => {
        window.scrollTo({ top: scrollY });
      }, 10);
    } catch {
      setMessage("Sepet güncellenemedi.");
    }
  };

  const deleteCartItem = async (cartItemId: number) => {
    try {
      await axios.delete(`http://localhost:3000/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch {
      setMessage("Ürün silinemedi.");
    }
  };

  const handleCheckout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/orders",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("🛍 Sipariş başarıyla oluşturuldu!");
      fetchCart();
    } catch {
      setMessage("Sipariş oluşturulamadı.");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const sortedItems = [...cartItems].sort((a, b) => a.id - b.id);

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        🛒 Sepetim
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {sortedItems.length === 0 ? (
        <Typography>Sepetiniz boş.</Typography>
      ) : (
        <>
          {sortedItems.map((item) => (
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
                <Box sx={{ minHeight: 60, overflow: "hidden" }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {item.product.title}
                  </Typography>
                  <Typography variant="body2">
                    ${item.product.price.toFixed(2)} x {item.quantity}
                  </Typography>
                </Box>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                sx={{ minWidth: 100, justifyContent: "flex-end" }}
              >
                <IconButton
                  type="button"
                  onClick={() => updateCart(item.product.id, 1)}
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  type="button"
                  onClick={() => updateCart(item.product.id, -1)}
                >
                  <RemoveIcon />
                </IconButton>
                <IconButton
                  type="button"
                  onClick={() => deleteCartItem(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Box>
          ))}

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6">Toplam: ${total.toFixed(2)}</Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleCheckout}
          >
            ✅ Siparişi Tamamla
          </Button>
        </>
      )}

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={message}
      />
    </Box>
  );
};

export default Cart;
