import React, { useEffect, useState } from "react";
//Chakra-ui
import { Button, Flex, Spinner, Text, useToast, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, Select, Heading } from "@chakra-ui/react";
//Created components for the App
import Cancel from "../components/Cancel/Cancel";
import Add from "../components/Add/Add";
import Layout from "../components/Layout/Layout";
//Context
import useEthersProvider from "../hooks/useEthersProvider";
//ABI Smart contract
import Contract from "../artifacts/contracts/RoomBooking.sol/RoomBooking.json";
//Ethersjs library
import { ethers } from "ethers";

const Home = () => {
  //Account & provider from Context
  const { account, provider } = useEthersProvider();
  //Is something loading ?
  const [isLoading, setIsLoading] = useState(false);
  //Timestamp of the Cola Day
  const [colaDayTimestamp, setColaDateTimestamp] = useState(null);
  //Planning in HTML
  const [planning, setPlanning] = useState(null);
  //Bookings of the connected user
  const [userBookings, setUserBookings] = useState(null)

  //Add form
  const [room, setRoom] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [brand, setBrand] = useState(null)

  //Smart contract address
  const contractAddress = "0x9EE3E0dEba95f66872ed7556f445375c78F9Df9D";

  const toast = useToast();

  const getDatas = async() => {
    setIsLoading(true);

    //Get All Bookings & the timestamp of the Cola Day
    const roomBookingContract = new ethers.Contract(
      contractAddress,
      Contract.abi,
      provider
    );
    let allBookings = await roomBookingContract.getAllBookings()
    let colaDayStartingTimestamp = await roomBookingContract.colaDayStartingTimestamp();
    setColaDateTimestamp(colaDayStartingTimestamp)

    //Get the bookings of a specific connected account
    let roomsBooked = [];
    for(let i = 0 ; i < allBookings.length ; i++) {
      if(allBookings[i].user == account) {
        roomsBooked.push(allBookings[i]);
      }
    }
    setUserBookings(roomsBooked);

    //Generate the planning
    let table = "<Table variant='simple'>";
    table += "<Tr><Td>Hours / Room</Td><Td>C1</Td><Td>C2</Td><Td>C3</Td><Td>C4</Td><Td>C5</Td><Td>C6</Td><Td>C7</Td><Td>C8</Td><Td>C9</Td><Td>C10</Td><Td>P1</Td><Td>P2</Td><Td>P3</Td><Td>P4</Td><Td>P5</Td><Td>P6</Td><Td>P7</Td><Td>P8</Td><Td>P9</Td><Td>P10</Td></Tr>"
    let planning = [];
    let count = 1;
    for(let i = 0 ; i < 24 ; i++) {
      let finalHour = i + 1;
      table += "<Tr><Td>" + i + "h - " + finalHour + "h</Td>";
      for(let j = 1 ; j <= 20 ; j++) {
        let salle;
        if(j <= 10) {
          salle = "C"+j;
        }
        else {
          let number = j - 10;
          salle = "P"+number;
        }
        let startingTimestamp = colaDayStartingTimestamp + 3600 * i;
        let endingTimestamp = colaDayStartingTimestamp + 3600 * (i + 1);
        let obj = {
          id: count,
          room: salle,
          startingTimestamp: startingTimestamp,
          endingTimestamp: endingTimestamp
        }
        planning.push(obj);

        let alreadyPlaced = false;
        
        for(let i = 0 ; i < allBookings.length ; i++) {
          if(startingTimestamp == allBookings[i].startingTime && endingTimestamp == allBookings[i].endingTime && salle == allBookings[i].roomName) {
            if(account == allBookings[i].user) {
              table += "<Td bgColor='orange'>Booked</Td>";
              alreadyPlaced = true;
            }
            else {
              table += "<Td bgColor='red'>Booked</Td>";
              alreadyPlaced = true;
            }
            
          }
        }

        if(!alreadyPlaced) {
          table += "<Td bgColor='green'>Free</Td>";
        }

        count++;
      }
      table += "</Tr>";
    }  
    table += "</Table>";
    setPlanning(table)
    setIsLoading(false)
  }

  //If a wallet is connected, get the datas
  useEffect(() => {
    if(account) {
      getDatas()
    }
  }, [account])

  function timeConverter(UNIX_timestamp, withhours){
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let time;
    if(withhours) {
      return time = date + ' ' + month + ' ' + year + ' ' + hour + 'h';
    }
    time = date + ' ' + month + ' ' + year;
    return time;
  }

  return (
    <Layout>
      <Flex align="center" justify="center">
        {isLoading ? (
          <Spinner />
        ) : (
          account && colaDayTimestamp ? (
            <Flex direction="column">
              <Heading align="center" mb="2rem">{timeConverter(colaDayTimestamp, false)} is COLA day!</Heading>
              <Heading mb="2rem">Planning</Heading>
              <div dangerouslySetInnerHTML={{__html: planning}}></div>
              <Heading as='h4' size='md' mt="2rem">
                Informations
              </Heading>
              <Table mt="1rem">
                <Tr>
                  <Td width="100px" bgColor="green">Free</Td>
                  <Td>Free room</Td>
                </Tr>
                <Tr>
                  <Td width="100px" bgColor="orange">Booked</Td>
                  <Td>Booked by you ({account.substring(0,5)}...{account.substring(account.length, account.length - 5)})</Td>
                </Tr>
                <Tr>
                  <Td width="100px" bgColor="red">Booked</Td>
                  <Td>Booked by an other account than yours</Td>
                </Tr>
              </Table>
              <Add contractAddress={contractAddress} colaDayTimestamp={colaDayTimestamp} room={room} setRoom={setRoom} brand={brand} setBrand={setBrand} startDate={startDate} setStartDate={setStartDate} getDatas={getDatas}></Add>
              <Cancel contractAddress={contractAddress} userBookings={userBookings} timeConverter={timeConverter} getDatas={getDatas}></Cancel>
            </Flex>
          ) : (
            <Text>Please connect your wallet.</Text>
          ) 
        )}
      </Flex>
    </Layout>
  );
};

export default Home;