"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/config/firebase";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

// Define validation schema with Yup
const schema = yup.object().shape({
  title: yup.string().required("Title is required").min(5, "Title must be at least 5 characters"),
  description: yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
  priority: yup.string().oneOf(["Low", "Medium", "High"], "Invalid priority"),
});

const priorities = ["Low", "Medium", "High"];

const AddTicket = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("id");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // Apply validation
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      status: "Open",
    },
  });

  // Fetch ticket data if editing
  useEffect(() => {
    if (!ticketId) return;

    const fetchTicket = async () => {
      try {
        const docRef = doc(db, "tickets", ticketId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const ticketData = docSnap.data();
          Object.keys(ticketData).forEach((key) => setValue(key, ticketData[key])); // Set values in the form
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
    };

    fetchTicket();
  }, [ticketId, setValue]);

  const onSubmit = async (data) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      if (ticketId) {
        // UPDATE EXISTING TICKET
        await updateDoc(doc(db, "tickets", ticketId), {
          ...data,
          updatedAt: new Date(),
        });
      } else {
        // CREATE NEW TICKET
        await addDoc(collection(db, "tickets"), {
          ...data,
          createdBy: user.uid,
          createdAt: new Date(),
        });
      }

      reset(); // Reset form after submission
      router.push("/"); // Redirect after saving
    } catch (error) {
      console.error("Error saving ticket:", error);
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={6}>
        <Paper style={{ padding: "20px" }}>
          <h2>{ticketId ? "Edit Ticket" : "Create Ticket"}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Title"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              required
              multiline
              rows={3}
              margin="normal"
            />
            <TextField
              fullWidth
              select
              label="Priority"
              {...register("priority")}
              error={!!errors.priority}
              helperText={errors.priority?.message}
              margin="normal"
            >
              {priorities.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <Button type="submit" variant="contained" color="primary" fullWidth>
              {ticketId ? "Update Ticket" : "Submit"}
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AddTicket;
