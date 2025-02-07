'use client';

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";

// Email validation helper
const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err) {
      console.error("Login failed:", err.message);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-md bg-white dark:bg-gray-800 transition duration-300">
        <CardContent>
          <Typography variant="h5" className="text-gray-900 dark:text-gray-100 text-center font-semibold">
            Login
          </Typography>
          <form onSubmit={handleLogin} className="mt-4 space-y-4">
            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              className="bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              className="bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              className="mt-2 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
