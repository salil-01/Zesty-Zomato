// components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Spacer, Text } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box bg="gray.200" p={4}>
      <Flex justifyContent={"space-around"} alignItems={"center"}>
        <Text fontSize="xl" fontWeight="bold">
          MyFoodApp
        </Text>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        {/* Show the Admin link if the user role is admin */}
        {localStorage.getItem("role") === "admin" && (
          <Link to="/admin">Admin</Link>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
