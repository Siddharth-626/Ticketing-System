"use client"; // Ensure it's a client component


import Providers from "@components/Providers";
import LayoutWrapper from "@layouts/LayoutWrapper";
import VerticalLayout from "@layouts/VerticalLayout";
import Navigation from "@components/layout/vertical/Navigation";
import Navbar from "@components/layout/vertical/Navbar";
import VerticalFooter from "@components/layout/vertical/Footer";
import { UserRoleProvider,useUserRoleContext } from "@/@menu/contexts/UserRoleContext";

const Layout = ({ children }) => {
  return (
    <UserRoleProvider>
      <Content>{children}</Content>
    </UserRoleProvider>
  );
};

// Separate component to use hooks properly inside the provider
const Content = ({ children }) => {
  const { userRole, loading } = useUserRoleContext(); // Use context

  if (loading) return <p className="text-lg">Loading...</p>;
  console.log("User Role:", userRole);

  return (
    <Providers direction="ltr">
      <LayoutWrapper
        verticalLayout={
          <VerticalLayout navigation={<Navigation />} navbar={<Navbar />} footer={<VerticalFooter />}>
            {children}
          </VerticalLayout>
        }
      />
    </Providers>
  );
};

export default Layout;
