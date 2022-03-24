// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

/// @author Ben BK https://twitter.com/BenBKTech
/// @title Room Booking System

import "@openzeppelin/contracts/utils/Counters.sol";

contract RoomBooking {

    using Counters for Counters.Counter;

    uint32 public colaDayStartingTimestamp;
    Counters.Counter private idBooking;

    enum Brand {
        coke,
        pepsi
    }

    Brand public brands;

    struct booking {
        uint32 id;
        address user;
        uint32 startingTime;
        uint32 endingTime;
        Brand brand;
        string roomName;
    }

    booking[] bookings;   

    constructor(uint32 _colaDayStartingTimestamp) {
        require(block.timestamp < _colaDayStartingTimestamp, "Can't start the Cola Day in the past");
        colaDayStartingTimestamp = _colaDayStartingTimestamp;
    }

    /**
    * @notice Allows only users to call a function
    **/
    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }

    /**
    * @notice Returns all the bookings in a table
    *
    * @return All the bookings
    **/
    function getAllBookings() external view callerIsUser returns(booking[] memory) {
        return bookings;
    }

    /**
    * @notice Allows to book a room
    *
    * @param _user Account of the user booking the room
    * @param _startingTime When the booking starts
    * @param _endingTime When the booking ends
    * @param _brand Brand that books the room
    * @param _roomName Name of the room
    * 
    **/
    function bookMeeting(address _user, uint32 _startingTime, uint32 _endingTime, Brand _brand, string memory _roomName) external callerIsUser {
        require(!isAlreadyBooked(_startingTime, _endingTime, _roomName), "Room already Booked");
        booking memory thisBooking = booking(uint32(idBooking.current()), _user, _startingTime, _endingTime, _brand, _roomName);
        bookings.push(thisBooking);
        idBooking.increment();
    }

    /**
    * @notice Cancel a booking
    *
    * @param _id Id of the room to be canceled
    * 
    **/
    function cancelBooking(uint32 _id) external callerIsUser {
        for(uint32 i = 0 ; i < bookings.length ; i++) {
            if(bookings[i].id == _id) {
                require(msg.sender == bookings[i].user, "Can't delete bookings of other people.");
                delete bookings[i];
            }
        }
    }

    /**
    * @notice Allows to check if a room is already booked
    *
    * @param _startingTime When the booking starts
    * @param _endingTime When the booking ends
    * @param _roomName Name of the room
    * 
    * @return true or false if a room is already booked or not
    *
    **/
    function isAlreadyBooked(uint32 _startingTime, uint32 _endingTime, string memory _roomName) internal view returns(bool) {
        bool result = false;
        for(uint i = 0 ; i < bookings.length ; i++) {
            if(keccak256(abi.encodePacked(bookings[i].roomName)) == keccak256(abi.encodePacked(_roomName))) {
                if((_startingTime >= bookings[i].startingTime && _startingTime < bookings[i].endingTime) 
                || (_endingTime > bookings[i].startingTime && _endingTime <= bookings[i].endingTime)) {
                    result = true;
                }
            }
        }
        return result;
    }

}