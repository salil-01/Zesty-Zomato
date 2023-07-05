import {
  Box,
  Button,
  Card,
  Divider,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";

function DishCard({ dish, onEdit, onDelete }) {
  //   console.log(dish);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editedDish, setEditedDish] = useState(dish);

  const handleEdit = () => {
    onOpen();
  };

  const handleSave = () => {
    onEdit(editedDish);
    onClose();
  };

  const handleDelete = () => {
    onDelete(dish.id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDish((prevDish) => ({ ...prevDish, [name]: value }));
  };

  return (
    <Card boxShadow="lg" borderRadius="md" p={4} mb={4}>
      <Heading textAlign={"center"} size="md" mb={2}>
        {dish.name}
      </Heading>
      <Text mb={2}>Price: ${dish.price}</Text>
      <Text mb={2}>Stock: {dish.stock}</Text>
      <Text mb={4}>Availability: {dish.availability}</Text>
      <HStack justifyContent={"space-around"} width={"50%"} margin={"auto"}>
        <Button colorScheme="teal" size="sm" onClick={handleEdit} mr={2}>
          Update
        </Button>
        <Button colorScheme="red" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Dish</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <Text>Name:</Text>
              <Input
                type="text"
                name="name"
                value={editedDish.name}
                onChange={handleChange}
              />
            </Box>
            <Box mb={4}>
              <Text>Price:</Text>
              <Input
                type="number"
                name="price"
                value={editedDish.price}
                onChange={handleChange}
              />
            </Box>
            <Box mb={4}>
              <Text>Stock:</Text>
              <Input
                type="number"
                name="stock"
                value={editedDish.stock}
                onChange={handleChange}
              />
            </Box>
            <Box mb={4}>
              <Text>Availability:</Text>
              <Select
                name="availability"
                value={editedDish.availability}
                onChange={handleChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Select>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Divider margin={"10px"} />
    </Card>
  );
}
export default DishCard;
