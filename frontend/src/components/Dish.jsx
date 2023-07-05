// components/Dish.js
import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  Select,
  useToast,
  Flex,
  Center,
  HStack,
} from "@chakra-ui/react";

const Dish = ({ dish }) => {
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();

  const handleOrder = () => {
    // Check if the user is logged in
    if (!localStorage.getItem("jwt")) {
      // Redirect to the login page
      window.location.href = "/login";
      return;
    }

    // Place the order for the dish
    fetch("/api/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        dishId: dish.id,
        quantity,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast({
          title: "Order Placed",
          description: `Total Price: ${data.totalPrice}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        toast({
          title: "Error",
          description: "Failed to place order",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Flex
      p={4}
      gap={"10px"}
      flexDirection={"column"}
      borderWidth="1px"
      borderRadius="md"
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
      <Button
        colorScheme="teal"
        onClick={handleOrder}
        disabled={dish.stock === 0}
      >
        Order
      </Button>
    </Flex>
  );
};

export default Dish;
