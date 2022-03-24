import React, { useEffect, useState } from "react";
import { Button, Flex, Spinner, Text, useToast, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, Select, Heading } from "@chakra-ui/react";
import useEthersProvider from "../../hooks/useEthersProvider";
import Contract from "../../artifacts/contracts/RoomBooking.sol/RoomBooking.json";
import { ethers } from "ethers";

const Add = (props) => {

    const { account, provider } = useEthersProvider();
    const toast = useToast();

    //Allows to book a room
    const addBooking = async() => {
        let signer = provider.getSigner();
        const roomBookingContract = new ethers.Contract(
          props.contractAddress,
          Contract.abi,
          signer
        );
        let endingTime = parseInt(props.startDate) + 3600;
        try {
          const transaction = await roomBookingContract.bookMeeting(account, props.startDate, endingTime, props.brand, props.room);
          await transaction.wait();
          toast({
            description: "Booking added!",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        }
        catch(err) {
          toast({
            description: "An error occured, please try again. (did you try to book a room already booked?)",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
        
        props.getDatas();
    }

    return (
        <Flex direction="column" mt="3rem">
            <Heading>Book a room for one hour</Heading>
            <Select onChange={(e) => props.setStartDate(e.target.value)} mt="2rem" placeholder='Select the starting hour' bg='white' borderColor='white'color='black'>
                <option value={props.colaDayTimestamp}>00h00</option>
                <option value={props.colaDayTimestamp + 3600}>01h00</option>
                <option value={props.colaDayTimestamp + 3600 * 2}>02h00</option>
                <option value={props.colaDayTimestamp + 3600 * 3}>03h00</option>
                <option value={props.colaDayTimestamp + 3600 * 4}>04h00</option>
                <option value={props.colaDayTimestamp + 3600 * 5}>05h00</option>
                <option value={props.colaDayTimestamp + 3600 * 6}>06h00</option>
                <option value={props.colaDayTimestamp + 3600 * 7}>07h00</option>
                <option value={props.colaDayTimestamp + 3600 * 8}>08h00</option>
                <option value={props.colaDayTimestamp + 3600 * 9}>09h00</option>
                <option value={props.colaDayTimestamp + 3600 * 10}>10h00</option>
                <option value={props.colaDayTimestamp + 3600 * 11}>11h00</option>
                <option value={props.colaDayTimestamp + 3600 * 12}>12h00</option>
                <option value={props.colaDayTimestamp + 3600 * 13}>13h00</option>
                <option value={props.colaDayTimestamp + 3600 * 14}>14h00</option>
                <option value={props.colaDayTimestamp + 3600 * 15}>15h00</option>
                <option value={props.colaDayTimestamp + 3600 * 16}>16h00</option>
                <option value={props.colaDayTimestamp + 3600 * 17}>17h00</option>
                <option value={props.colaDayTimestamp + 3600 * 18}>18h00</option>
                <option value={props.colaDayTimestamp + 3600 * 19}>19h00</option>
                <option value={props.colaDayTimestamp + 3600 * 20}>20h00</option>
                <option value={props.colaDayTimestamp + 3600 * 21}>21h00</option>
                <option value={props.colaDayTimestamp + 3600 * 22}>22h00</option>
                <option value={props.colaDayTimestamp + 3600 * 23}>23h00</option>
            </Select>
            <Select onChange={(e) => props.setBrand(e.target.value)} mt="1rem" placeholder='Select your brand' bg='white' borderColor='white'color='black'>
                <option value="0">Coca</option>
                <option value="1">Pepsi</option>
            </Select>
            <Select onChange={(e) => props.setRoom(e.target.value)} mt="1rem" placeholder='Select your room' bg='white' borderColor='white'color='black'>
            <option value="C1">C1</option>
                <option value="C2">C2</option>
                <option value="C3">C3</option>
                <option value="C4">C4</option>
                <option value="C5">C5</option>
                <option value="C6">C6</option>
                <option value="C7">C7</option>
                <option value="C8">C8</option>
                <option value="C9">C9</option>
                <option value="C10">C10</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
                <option value="P4">P4</option>
                <option value="P5">P5</option>
                <option value="P6">P6</option>
                <option value="P7">P7</option>
                <option value="P8">P8</option>
                <option value="P9">P9</option>
                <option value="P10">P10</option>
            </Select>
            <Button mt="1rem" colorScheme="teal" onClick={() => addBooking()}>Book</Button>
        </Flex>
    )
}

export default Add;