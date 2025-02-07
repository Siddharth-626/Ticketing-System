"use client"; // This must be a client component
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For error handling
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true); // Ensure loading state is updated correctly
      const user = auth.currentUser;
      console.log(user);
      
      if (!user) {
        setLoading(false); // Set loading to false before redirecting
        router.replace("/login"); // Use replace to prevent back navigation
        return;
      }
      console.log("Current user:", user);
      

      try {
        const userRef = doc(db, "users", user.uid);
        console.log("userRef:", userRef);
        
        const userSnap = await getDoc(userRef);
        console.log("userSnap:", userSnap);
        
        
        
        // Check if userSnap exists and data() returns a valid object
        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log("userData:", userData);
          
          if (userData && userData.role) {
            setUserRole(userData.role);
          } else {
            console.log("guest1");
            
            setUserRole("guest"); // Default role if no 'role' field
          }
        } else {
            console.log("guest2");
          setUserRole("guest"); // Default role if document doesn't exist
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setError("Failed to fetch user role");
      } finally {
        setLoading(false); // Ensure loading is always updated
      }
    };

    fetchUserRole();
  }, [router]);

  return { userRole, loading, error };
};

export default useUserRole;
