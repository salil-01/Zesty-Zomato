import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle register logic here
    // ...
  };

  return (
    <Box
      maxWidth="md"
      mx="auto"
      mt={8}
      p={4}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="lg"
    >
      <Heading mb={4}>Register</Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          <FormControl id="role">
            <FormLabel>Role</FormLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </Select>
          </FormControl>
          <Button colorScheme="teal" type="submit">
            Register
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default RegisterForm;
