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
  Textarea,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
// import {  } from "react-icons/fa";
export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [userText, setUserText] = useState("");
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    setUserText(userInput);
    setUserInput("");
    const response = "This is a dummy response from the bot";
    setBotResponse(response);
  };

  return (
    <>
      <Button
        onClick={toggleModal}
        position="fixed"
        bottom="4"
        right="4"
        zIndex="999"
      >
        <ChatIcon />
        {/* <Icon as={<ChatIcon />} boxSize={6} /> */}
      </Button>

      <Modal isOpen={isOpen} onClose={toggleModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat with FoodBot</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxHeight="400px" overflowY="auto">
            {/* Display the chat conversation */}
            {userText && (
              <div>
                <strong>You:</strong> {userText}
              </div>
            )}
            {botResponse && (
              <div>
                <strong>FoodBot:</strong> {botResponse}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <FormControl flex="1">
              <Textarea
                placeholder="Type your Query here..."
                value={userInput}
                onChange={handleInputChange}
              />
            </FormControl>
            <Button onClick={handleSendMessage} colorScheme="blue" ml={4}>
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
