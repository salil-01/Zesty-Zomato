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
        <Link to="/">
          <Text fontSize={"1.2rem"} fontWeight="bold">
            BiteBook
          </Text>
        </Link>
        <Link to="/login">
          <Text fontSize={"1.2rem"}>Login</Text>
        </Link>
        <Link to="/register">
          <Text fontSize={"1.2rem"}>Register</Text>
        </Link>
        {/* Show the Admin link if the user role is admin */}
        {role == "Admin" && auth && (
          <Link to="/admin">
            <Text fontSize={"1.2rem"}>Admin</Text>
          </Link>
        )}
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
