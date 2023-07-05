import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import DishCard from "../components/DishCard";
import { AuthContext } from "../context/AuthContext";
import OrdersPage from "../components/Orders";
import AddDish from "../components/AddDish";
const url = "http://127.0.0.1:5000";
function Admin() {
  const [inventoryComponent, setInventoryComponent] = useState(true);
  const [orderComponent, setOrderComponent] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const toast = useToast();

  const handleClick1 = () => {
    setInventoryComponent(true);
    setOrderComponent(false);
  };

  const handleClick2 = () => {
    setInventoryComponent(false);
    setOrderComponent(true);
  };
  function fetchData() {
    setLoading(true);
    fetch(`${url}/dish`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDishes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }
  useEffect(() => {
    // Fetch dish data from the "/dish" route
    fetchData();
  }, []);

  const handleEditDish = (dish) => {
    // Handle the edit functionality for a specific dish
    // console.log("Edit dish:", dish);
    dish = { ...dish, stock: +dish.stock, price: +dish.price };
    setLoading(true);
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
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
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
    // console.log("Delete dish with ID:", dishId);
    setLoading(true);
    fetch(`${url}/dish/${dishId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        toast({
          title: "Dish Deleted Successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        fetchData();
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast({
          title: "Error while Deleting Dish",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <Flex
        margin={"40px auto"}
        width={"40%"}
        justifyContent={"space-around"}
        alignItems={"center"}
      >
        <Button
          bg={inventoryComponent ? "orange" : null}
          color={inventoryComponent ? "white" : "black"}
          variant={"outline"}
          _hover={{
            color: "black",
          }}
          colorScheme={"orange"}
          onClick={handleClick1}
        >
          Inventory
        </Button>
        <Button
          variant={"outline"}
          colorScheme={"orange"}
          _hover={{
            color: "black",
          }}
          onClick={handleClick2}
          bg={orderComponent ? "orange" : null}
          color={orderComponent ? "white" : "black"}
        >
          Orders
        </Button>
        <AddDish fetchData={fetchData} setLoading={setLoading} />
      </Flex>
      {inventoryComponent && (
        <SimpleGrid
          width={"90%"}
          margin={"auto"}
          gap={4}
          templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        >
          {loading ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="80vh"
            >
              <Spinner size="xl" />
            </Box>
          ) : (
            dishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onEdit={handleEditDish}
                onDelete={handleDeleteDish}
              />
            ))
          )}
        </SimpleGrid>
      )}
      {orderComponent && <OrdersPage />}
    </>
  );
}

export default Admin;
