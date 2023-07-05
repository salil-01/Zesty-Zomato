// components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Button,
} from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChevronDownIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const { role, auth, name, logout } = useContext(AuthContext);
  const handleClick = () => {
    logout();
  };
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
        {role == "Admin" && auth && <Link to="/admin">Admin</Link>}
        {auth && (
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {name}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleClick}>Logout</MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
