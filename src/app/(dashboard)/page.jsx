"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/config/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useUserRoleContext } from "@/@menu/contexts/UserRoleContext";

// MUI Imports
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const DashboardAnalytics = () => {
  const router = useRouter();
  const { userRole, loading } = useUserRoleContext();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;

        let q;
        if (userRole === "agent" || userRole === "admin") {
          q = query(collection(db, "tickets")); 
        } else {
          q = query(collection(db, "tickets"), where("createdBy", "==", user.uid));
        }

        const querySnapshot = await getDocs(q);
        const ticketList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTickets(ticketList);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [userRole, loading]);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await updateDoc(doc(db, "tickets", ticketId), { status: newStatus });
      setTickets(prevTickets => prevTickets.map(ticket => ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket));
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  if (loading || isLoading) return <p className="text-lg">Loading...</p>;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
        <h2>Tickets</h2>
        {userRole === "customer" && (
          <Button variant="contained" color="primary" onClick={() => router.push("/add-ticket")}>
            Add Ticket
          </Button>
        )}
      </Grid>

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.description}</TableCell>
                  <TableCell>{ticket.priority}</TableCell>
                  <TableCell>{ticket.status || "Open"}</TableCell>
                  <TableCell>
                    {userRole === "customer" ? (
                      <>
                        <Button 
                          onClick={() => router.push(`/add-ticket?id=${ticket.id}`)}
                          color="primary"
                        >
                          Edit
                        </Button>
                        <Button color="error">
                          Delete
                        </Button>
                      </>
                    ) : userRole === "agent" ? (
                      <>
                        <Select
                          value={ticket.status || "Open"}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        >
                          <MenuItem value="Open">Open</MenuItem>
                          <MenuItem value="In Progress">In Progress</MenuItem>
                          <MenuItem value="Closed">Closed</MenuItem>
                        </Select>
                        <Button onClick={() => router.push(`/ticket/${ticket.id}`)} color="secondary">
                          View
                        </Button>
                      </>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default DashboardAnalytics;
