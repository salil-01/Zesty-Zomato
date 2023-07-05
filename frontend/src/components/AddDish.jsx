import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const url = "http://127.0.0.1:5000";
function AddDish({ fetchData, setLoading }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { token } = useContext(AuthContext);
  const initialFormData = {
    name: "",
    price: "",
    availability: "Yes",
    stock: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: +formData.price,
      stock: +formData.stock,
    };
    // console.log(data);
    setLoading(true);
    fetch(`${url}/dish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        toast({
          title: "Dish Added Successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        fetchData();
        setLoading(false);
        setFormData(initialFormData);
        onClose();
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast({
          title: "Error while Adding Dish",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
    // onSubmit(formData);
    // setFormData(initialFormData);
  };

  return (
    <>
      <Button onClick={onOpen}>Add Dish</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Dish</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Price</FormLabel>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Availability</FormLabel>
                <Select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Stock</FormLabel>
                <Input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="blue">
                Submit
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddDish;
