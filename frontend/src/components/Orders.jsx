import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Select,
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
        setOrders(data);
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

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.patch(`/api/orders/${orderId}`, { status });
      toast({
        title: "Order updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchData();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toast = useToast();

  return (
    <Box p={4}>
      <TableContainer margin={"auto"} width={"70%"}>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th fontSize={"0.9rem"}>Order ID</Th>
              <Th fontSize={"0.9rem"}>Name</Th>
              <Th fontSize={"0.9rem"}>Price</Th>
              <Th fontSize={"0.9rem"}>Status</Th>
              <Th fontSize={"0.9rem"} textAlign={"center"}>
                Action
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.order_id}>
                <Td>{order.order_id}</Td>
                <Td>{order.customer}</Td>
                <Td>$ {order.total_price}</Td>
                <Td>{order.status}</Td>
                <Td>
                  <Select
                    // width={"50%"}
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Completed">Completed</option>
                  </Select>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default OrdersPage;
