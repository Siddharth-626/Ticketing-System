"use client"; // Ensure it's a client component

import { createContext, useContext } from "react";
import useUserRole from "../hooks/useUserRole";


const UserRoleContext = createContext(null);

export const UserRoleProvider = ({ children }) => {
  const { userRole, loading } = useUserRole(); // Fetch role from hook

  return (
    <UserRoleContext.Provider value={{ userRole, loading }}>
      {children}
    </UserRoleContext.Provider>
  );
};

// Custom hook for using UserRoleContext
export const useUserRoleContext = () => {
  return useContext(UserRoleContext);
};