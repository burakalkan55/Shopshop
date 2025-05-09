import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Snackbar,
} from "@mui/material";

interface OrderItem {
  product: {
    title: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface Order {
  id: number;
  createdAt: string;
  items: OrderItem[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState<string>("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch {
      setMessage("Failed to fetch orders.");
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        🧾 Order History
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        orders.map((order) => (
          <Card key={order.id} sx={{ mb: 4, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                🧾 Order #{order.id} – {new Date(order.createdAt).toLocaleString("en-US")}
              </Typography>

              {order.items.map((item, idx) => (
                <Box key={idx} sx={{ display: "flex", mb: 1, alignItems: "center" }}>
                  <CardMedia
                    component="img"
                    image={item.product?.image}
                    alt={item.product?.title}
                    sx={{ width: 60, height: 60, objectFit: "contain", mr: 2 }}
                  />
                  <Box>
                    <Typography>{item.product?.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.product?.price.toFixed(2)} x {item.quantity}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))
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

export default Orders;
