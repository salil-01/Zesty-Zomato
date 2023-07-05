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
const url = "http://127.0.0.1:5000";
export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [botResponse, setBotResponse] = useState(
    "Hello, How Can I assist You?"
  );
  const [loading, setLoading] = useState(false);
  const [userText, setUserText] = useState("");
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    setUserText(userInput);
    setLoading(true);
    fetch(`${url}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_message: userText }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setLoading(false);
        setBotResponse(data.response);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setBotResponse("Server Connection Failed");
      });
    setUserInput("");
  };

  return (
    <>
      <Button
        onClick={toggleModal}
        position="fixed"
        bottom="10"
        right="10"
        zIndex="1"
        bg={"teal.100"}
        padding={"15px"}
        // border={"1px  gray"}
      >
        <ChatIcon boxSize={"25px"} />
        {/* <Icon as={<ChatIcon />} boxSize={6} /> */}
      </Button>

      <Modal isOpen={isOpen} onClose={toggleModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat with FoodBuddy</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxHeight="400px" overflowY="auto">
            {/* Display the chat conversation */}
            {userText && (
              <div>
                <strong>You :</strong> {userText}
              </div>
            )}

            <div>
              <strong>FoodBuddy :</strong>{" "}
              {loading ? "Loading..." : botResponse}
            </div>
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
