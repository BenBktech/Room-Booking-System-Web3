import React, { useEffect, useState } from "react";
import { Button, Flex, Spinner, Text, useToast, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, Select, Heading } from "@chakra-ui/react";
import useEthersProvider from "../../hooks/useEthersProvider";
import Contract from "../../artifacts/contracts/RoomBooking.sol/RoomBooking.json";
import { ethers } from "ethers";

const Cancel = (props) => {

    const { account, provider } = useEthersProvider();
    const toast = useToast();

    //Allows to cancel a booking
    const cancel = async(id) => {
        let signer = provider.getSigner();
        const roomBookingContract = new ethers.Contract(
          props.contractAddress,
          Contract.abi,
          signer
        );
        try {
          const transaction = await roomBookingContract.cancelBooking(id);
          await transaction.wait();
          toast({
            description: "Booking canceled!",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        }
        catch(err) {
          toast({
            description: "An error occured, please try again.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
        props.getDatas();
    }

    return (
        <Flex direction="column">
            <Heading mt="2rem">Cancel a booking</Heading>
              {props.userBookings.length > 0 ? (
                props.userBookings.map((el) => {
                  return (
                      <Flex align="center">
                          <Text>Cancel Meeting in room {el.roomName} starting at {props.timeConverter(el.startingTime, true)}</Text>
                          <Button ml="1rem" mt="1rem" colorScheme="red" onClick={() => cancel(el.id)}>X</Button>
                      </Flex>
                  )
                })
              ) : (
                <Text mt="1rem">You have no bookings for the moment</Text>
              )}
        </Flex>
    )
}

export default Cancel;