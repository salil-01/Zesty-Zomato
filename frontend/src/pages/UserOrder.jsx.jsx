import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const url = "http://127.0.0.1:5000";
export const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    setLoading(true);
    fetch(`${url}/orders-user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOrders(data.orders);
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }
  return (
    <>
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
        <Table
          variant="striped"
          width={"80%"}
          margin={"auto"}
          colorScheme="teal"
        >
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Item ID</Th>
              <Th>Total Price</Th>
              <Th>Status</Th>
              <Th>Rating</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders?.map((order) => (
              <Tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>{order.item_id}</Td>
                <Td>{order.total_price}</Td>
                <Td>{order.status}</Td>
                <Td textAlign={"center"}>{order.rating}</Td>
                <Td>
                  {order.status === "Delivered" ? (
                    <FormControl>
                      <Select
                        placeholder="Select Rating"
                        onChange={(event) =>
                          handleRatingChange(event, order.id)
                        }
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </Select>
                      <FormErrorMessage>Error message here</FormErrorMessage>
                    </FormControl>
                  ) : null}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </>
  );
};
