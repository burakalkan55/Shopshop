import React, { useEffect, useState } from "react";
import axios from "axios";
import PersonIcon from '@mui/icons-material/Person';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Snackbar,
  Stack,
  Paper,
  Avatar,
} from "@mui/material";

const UserManagement: React.FC = () => {
 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // const [user, setUser] = useState<any>(null); ❌ kaldır

const fetchUserInfo = async () => {
  try {
    const response = await axios.get("http://localhost:3000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // setUser(response.data); // ❌ kaldır
    setName(response.data.name);
    setEmail(response.data.email);
    setImage(response.data.image || "");
  } catch (err) {
    setMessage("Failed to fetch user info.");
  }
};


  const updateUserInfo = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (file) formData.append("image", file);

      await axios.patch("http://localhost:3000/users/me", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Profile updated successfully.");
      fetchUserInfo();
    } catch (err) {
      setMessage("Profile update failed.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") setImage(reader.result);
      };
      reader.readAsDataURL(selected);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          👤 Profile Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack spacing={2} alignItems="center">
          <Avatar
           src={image?.startsWith("/uploads") ? `${import.meta.env.VITE_API_URL}${image}` : image}

            sx={{ width: 100, height: 100, mb: 2 }}
          >
            {!image && <PersonIcon sx={{ fontSize: 60 }} />}
          </Avatar>

          <Button variant="outlined" component="label">
            Upload Photo
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>

          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={updateUserInfo}>
            Save Changes
          </Button>
        </Stack>
      </Paper>

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={message}
      />
    </Box>
  );
};

export default UserManagement;
