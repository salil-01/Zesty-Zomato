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
} from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const url = "http://127.0.0.1:5000";
const Dish = ({ dish }) => {
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();
  const { auth, token } = useContext(AuthContext);

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
        items: [{ item_id: dish.id, quantity: quantity }],
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
        });
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        toast({
          title: "Error",
          description: "Failed to place order",
          status: "error",
          duration: 2000,
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
        isDisabled={dish.stock === 0}
      >
        Order
      </Button>
    </Flex>
  );
};

export default Dish;
