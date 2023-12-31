// components/Dish.js
import React, { useState } from "react";
import {
  Button,
  Text,
  Select,
  useToast,
  Flex,
  Center,
  HStack,
  VStack,
  Heading,
  Box,
} from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const url = "http://127.0.0.1:5000";
const Dish = ({ dish, fetchData }) => {
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();
  const { auth, token } = useContext(AuthContext);
  console.log(dish);
  const handleOrder = () => {
    // Check if the user is logged in
    if (!auth) {
      // Redirect to the login page
      toast({
        title: "Please Login to Place Order",
        position: "top",
        status: "error",
        variant: "top-accent",
        duration: 1500,
        isClosable: true,
      });
      return;
    }

    // Place the order for the dish
    fetch(`${url}/place-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: dish.id,
        quantity: quantity,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        toast({
          title: "Order Placed Successfully",
          description: `Total Price: $ ${data.total_price}`,
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        fetchData();
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        toast({
          title: "Error",
          description: "Failed to place order",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      });
  };

  return (
    <Flex
      p={4}
      gap={"10px"}
      flexDirection={"column"}
      borderWidth="1px"
      bg={"gray.200"}
      padding={"20px"}
      borderRadius={"5px"}
    >
      <Center>
        <Text fontSize="lg" fontWeight="bold">
          {dish.name}
        </Text>
      </Center>
      <Text>Price : $ {dish.price}</Text>
      <Text>Stock : {dish.stock}</Text>
      <HStack gap={"20px"}>
        <Text>Quantity : </Text>
        <Select
          width={"20%"}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        >
          {Array.from({ length: dish.stock }, (_, i) => i + 1).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
      </HStack>
      {dish?.reviews?.length > 0 ? (
        <Box
          margin={"20px 0px 20px 0px"}
          border={"1px dotted green"}
          padding={"15px"}
        >
          <Center mb={"10px"}>
            <Text fontSize={"1.1rem"}>Customer Reviews</Text>
          </Center>
          <Flex
            flexDirection={"column"}
            gap={"10px"}
            justifyItems={"flex-start"}
          >
            <Flex justifyContent={"left"} gap={"50px"}>
              <Text fontWeight={"bold"}>Name : {dish.reviews[0].email}</Text>
              <Text fontWeight={"bold"}>
                Rating : {dish.reviews[0].rating}⭐
              </Text>
            </Flex>
            <Text>Review : {dish.reviews[0].review_comment}</Text>
          </Flex>
        </Box>
      ) : null}
      <Button
        colorScheme="teal"
        onClick={handleOrder}
        isDisabled={dish.stock === 0}
      >
        Order
      </Button>
    </Flex>
  );
};

export default Dish;
