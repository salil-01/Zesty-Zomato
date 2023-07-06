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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const url = "http://127.0.0.1:5000";
const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password && role) {
      const formData = {
        email,
        password,
        role,
      };
      setLoading(true);
      try {
        const response = await axios.post(`${url}/register`, formData);
        console.log(response);
        setLoading(false);
        toast({
          title: "Account Created Successfully",
          position: "top",
          status: "success",
          variant: "top-accent",
          duration: 2000,
          isClosable: true,
        });
        setEmail("");
        setPassword("");
        setRole("");
        navigate("/login");
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast({
          title: "Server Error",
          position: "top",
          status: "error",
          variant: "top-accent",
          duration: 1500,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Please fill in all the fields",
        position: "top",
        status: "error",
        variant: "top-accent",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxWidth="md"
      mx="auto"
      mt={"10%"}
      p={8}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="lg"
      border={"1px dotted gray"}
    >
      <Heading mb={4} textAlign={"center"}>
        Register
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              border={"1px solid brown"}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              border={"1px solid brown"}
            />
          </FormControl>
          <FormControl id="role">
            <FormLabel>Role</FormLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              border={"1px solid brown"}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </Select>
          </FormControl>
          <Button
            colorScheme="teal"
            type="submit"
            isLoading={loading}
            loadingText="Registering..."
          >
            Register
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default RegisterForm;
