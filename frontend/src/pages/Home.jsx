// pages/Home.js
import React, { useState, useEffect } from "react";
import { Box, Center, Grid, Heading, Spinner } from "@chakra-ui/react";
import Dish from "../components/Dish";
const url = "http://127.0.0.1:5000";
const Home = () => {
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    // Fetch the menu data from the API
    fetch(`${url}/menu`)
      .then((response) => response.json())
      .then((data) => {
        setMenu(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="80vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Center margin={"20px"}>
        <Heading>Menu List</Heading>
      </Center>
      <Grid gap={4} templateColumns="repeat(auto-fit, minmax(300px, 1fr))">
        {menu.map((dish) => (
          <Dish key={dish.id} dish={dish} />
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
