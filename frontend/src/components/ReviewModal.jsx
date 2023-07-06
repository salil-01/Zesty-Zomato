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

const ReviewModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  //   const { token } = useContext(AuthContext);
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Call the onSubmit function with the rating and review text
    // onSubmit({ rating, reviewText });

    // Clear the form inputs
    setRating("");
    setReviewText("");

    // Close the modal
    onClose();
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
