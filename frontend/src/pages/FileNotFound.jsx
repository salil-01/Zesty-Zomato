import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const FileNotFound = () => {
  return (
    <Flex align="center" justify="center" height="90vh">
      <Box textAlign="center">
        <Heading fontSize="4xl" mb={4}>
          Oops!
        </Heading>
        <Text fontSize="lg" mb={4}>
          Page not found.
        </Text>
        <Text fontSize="md" color="gray.500">
          The requested page could not be found on the server.
          <br />
          Move to{" "}
          <Link to={"/"}>
            <Text
              as={"span"}
              fontSize={"1.1rem"}
              fontWeight={"bold"}
              color={"black"}
              textDecoration={"underline"}
            >
              Dashboard
            </Text>
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default FileNotFound;
