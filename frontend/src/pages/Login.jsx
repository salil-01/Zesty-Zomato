import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const url = "http://127.0.0.1:5000";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email,
      password,
    };
    setLoading(true);
    try {
      let response = await axios.post(`${url}/login`, formData);
      console.log(response);
      if (response.data.token && response.data.email) {
        setLoading(false);
        login(response.data.token, response.data.email, response.data.role);
        setEmail("");
        setPassword("");
        toast({
          title: "Login Successfull",
          description: `Welcome ${response.data.email}`,
          position: "top",
          status: "success",
          variant: "top-accent",
          duration: 2000,
          isClosable: true,
        });
        navigate("/");
      } else {
        setLoading(false);
        toast({
          title: "Invalid Credentials",
          position: "top",
          status: "error",
          variant: "top-accent",
          duration: 2000,
          isClosable: true,
        });
      }
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast({
        title: "Server Error",
        position: "top-right",
        status: "error",
        variant: "top-accent",
        duration: 2000,
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
        Login
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              border={"1px solid brown"}
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
              border={"1px solid brown"}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          <Button
            isLoading={loading}
            loadingText="Logging In"
            colorScheme="teal"
            type="submit"
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginForm;
