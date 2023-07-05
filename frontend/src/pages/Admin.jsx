import { Center, Flex, Heading, SimpleGrid, useToast } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import DishCard from "../components/DishCard";
import { AuthContext } from "../context/AuthContext";
const url = "http://127.0.0.1:5000";
function Admin() {
  const [dishes, setDishes] = useState([]);
  const { token } = useContext(AuthContext);
  const toast = useToast();
  function fetchData() {
    fetch(`${url}/dish`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setDishes(data))
      .catch((error) => console.log(error));
  }
  useEffect(() => {
    // Fetch dish data from the "/dish" route
    fetchData();
  }, []);

  const handleEditDish = (dish) => {
    // Handle the edit functionality for a specific dish
    console.log("Edit dish:", dish);
    dish = { ...dish, stock: +dish.stock, price: +dish.price };
    fetch(`${url}/dish/${dish.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dish),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        toast({
          title: "Dish Updated Successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        fetchData();
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error while Updating Dish",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const handleDeleteDish = (dishId) => {
    // Handle the delete functionality for a specific dish
    console.log("Delete dish with ID:", dishId);
  };

  return (
    <>
      <Flex justifyContent={"space-around"} width={"40%"} margin={"auto"}>
        <Link to={"/admin"}> Inventory </Link>
        <Link to={"/orders"}> Orders </Link>
      </Flex>
      <SimpleGrid
        gap={4}
        templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
      >
        {dishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            onEdit={handleEditDish}
            onDelete={handleDeleteDish}
          />
        ))}
      </SimpleGrid>
    </>
  );
}

export default Admin;
