"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; 
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Paper, Grid, Typography, CircularProgress } from "@mui/material";

const TicketDetails = () => {
  const router = useRouter();
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTicket = async () => {
      try {
        const docRef = doc(db, "tickets", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const ticketData = docSnap.data();
          
          // Convert Firestore timestamp to readable date format
          if (ticketData.dueDate && ticketData.dueDate.seconds) {
            ticketData.dueDate = new Date(ticketData.dueDate.seconds * 1000).toLocaleString();
          }

          setTicket(ticketData);
        } else {
          console.error("Ticket not found");
        }
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!ticket) return <Typography variant="h6">Ticket not found</Typography>;

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={6}>
        <Paper style={{ padding: "20px" }}>
          <Typography variant="h4" gutterBottom>
            Ticket Details
          </Typography>
          <Typography variant="h6">Title: {ticket.title}</Typography>
          <Typography>Description: {ticket.description}</Typography>
          <Typography>Priority: {ticket.priority}</Typography>
          <Typography>Category: {ticket.category}</Typography>
          <Typography>Contact Email: {ticket.contactEmail}</Typography>
          <Typography>Phone: {ticket.phone}</Typography>
          <Typography>Due Date: {ticket.dueDate}</Typography>
          <Typography>Urgent: {ticket.isUrgent ? "Yes" : "No"}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TicketDetails;
