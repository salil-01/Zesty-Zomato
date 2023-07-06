import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const url = "http://127.0.0.1:5000";
const ReviewModal = ({ order_id, dish_id, fetchData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { token } = useContext(AuthContext);
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  // function to update orders
  function updateOrderRating(order_id, rating) {
    order_id = +order_id;
    rating = +rating;
    fetch(`${url}/orders-user/${order_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        //calling fetch data again to show updated rating in orders
        fetchData();
        toast({
          title: "Review Added Successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
        setRating("");
        setReviewText("");
        fetchData();
        onClose();
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast({
          title: "Error while Adding Review",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      dish_id: +dish_id,
      rating: +rating,
      review_comment: reviewText,
    };
    // function to post a new review
    setLoading(true);
    fetch(`${url}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        updateOrderRating(order_id, rating);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    //

    // Close the modal
    // onClose();
  };

  return (
    <>
      <Button onClick={onOpen} variant={"outline"} colorScheme={"blue"}>
        Add a Review
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leave a Review</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl>
                <FormLabel>Rating (1-5)</FormLabel>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={rating}
                  onChange={handleRatingChange}
                  required
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Review Text (Max 50 characters)</FormLabel>
                <Input
                  type="text"
                  maxLength={50}
                  value={reviewText}
                  onChange={handleReviewTextChange}
                  required
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Submit
              </Button>
              <Button ml={2} onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReviewModal;
