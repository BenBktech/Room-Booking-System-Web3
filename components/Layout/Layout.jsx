import React from "react";
import { Flex } from "@chakra-ui/layout";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const Layout = (props) => {
  return (
    <>
      <Flex
        w="100%"
        h="100%"
        minH="100vh"
        bgColor="#0e0e0e"
        color="white"
        fontFamily="Space Grotesk, sans-serif"
        flexDir="column"
        alignItems="stretch"
      >
        <Header />
        <Flex
          align="center"
          justify="center"
          flexDir="column"
          w="100%"
          flex={1}
        >
          {props.children}
        </Flex>
        <Footer />
      </Flex>
    </>
  );
};

export default Layout;