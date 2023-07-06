import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const url = "http://127.0.0.1:5000";
function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  function fetchData() {
    setLoading(true);
    fetch(`${url}/orders`, {
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
  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = (orderId, status) => {
    console.log(orderId, status);
    setLoading(true);
    fetch(`${url}/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        toast({
          title: "Order Updated Successfully",
          position: "top",
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
          title: "Error while Updating Order",
          position: "top",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const toast = useToast();

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
        <Box p={4}>
          <TableContainer margin={"auto"} width={"70%"}>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th fontSize={"0.9rem"}>Order ID</Th>
                  <Th fontSize={"0.9rem"}>Name</Th>
                  <Th fontSize={"0.9rem"}>Price</Th>
                  <Th fontSize={"0.9rem"}>Status</Th>
                  <Th fontSize={"0.9rem"}>Rating</Th>
                  <Th fontSize={"0.9rem"} textAlign={"center"}>
                    Action
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order) => (
                  <Tr key={order.id}>
                    <Td>{order.id}</Td>
                    <Td>{order.email}</Td>
                    <Td>$ {order.total_price}</Td>
                    <Td>{order.status}</Td>
                    <Td>{order.rating ? order.rating : 0}</Td>
                    <Td>
                      <Select
                        // width={"50%"}
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                      >
                        <option value="">Update Status</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Pickup">Pickup</option>
                        <option value="Delievered">Delievered</option>
                      </Select>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
}

export default OrdersPage;
