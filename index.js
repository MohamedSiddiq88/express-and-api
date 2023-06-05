// import fs , express 
// const fs = require("fs");
// const express = require("express");
// const { error } = require("console");
import express from "express";
import fs from "fs";
import {error} from "console";

//intialize the express
const app = express();
app.use(express.json())

const PORT=process.env.PORT;

//create hallData
let hallData = [];


app.get("/",(req,res)=>{
    res.send("welcome")
})

app.get("/hall-ticket/all-data", (req, res) => {
    res.send(hallData);
});


//use json data
fs.readFile("./hallData.json","utf-8", (error, data) => {
    if (error) {
        console.log(error);
    } else {
        hallData = JSON.parse(data);
    

//create new room
app.post("/add/hall-ticket", (req, res) => {

    const newEntry = {
        id: hallData.length + 100,
        numberOfSeats: req.body.numberOfSeats,
        amenities: req.body.amenities,
        price: req.body.price,
        ifBooked: req.body.ifBooked,
        customerName: req.body.customerName,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        RoomId: req.body.RoomId,
        RoomName: req.body.RoomName
    };

    hallData.push(newEntry);

    return res.send(hallData);
});



//book a room
app.put("/edit/hall-ticket/:id", (req, res) => {
    const { id } = req.params;
    let filterHallData = hallData.filter((ele) => ele.id == id)

    // let { name,date,startTime,endTime } = req.query;
    console.log(filterHallData);

    if (filterHallData[0].ifBooked == false) {
        filterHallData[0].ifBooked = true;
        filterHallData[0].customerName = req.body.customerName;
        filterHallData[0].date = req.body.date;
        filterHallData[0].startTime = req.body.startTime;
        filterHallData[0].endTime = req.body.endTime;
        console.log(hallData);
        return res.send(filterHallData);
    } else {
        return res.status(400).send("sorry already booked");
    }
})


// list all room with booked data
app.get("/hall-ticket/booked-room", (req, res) => {
    const filterHallData = [...hallData]; // Create a copy of hallData
    const bookedRooms = filterHallData
      .filter((ele) => ele.ifBooked)
      .map((ele) => ele.RoomName);
    console.log("List of all booked rooms:", bookedRooms);
    res.send(bookedRooms);
  });
  
  // list all customers with booked data
  app.get("/hall-ticket/customer", (req, res) => {
    const filterHallData = [...hallData]; // Create a copy of hallData
    const bookedCustomers = filterHallData
      .filter((ele) => ele.ifBooked)
      .map((ele) => ele.customerName);
    console.log("List of all customers who booked a room:", bookedCustomers);
    res.send(bookedCustomers);
  });
  
  // list how many times each customer has booked a room
  app.get("/hall-ticket/customer-count", (req, res) => {
    const filterHallData = [...hallData]; // Create a copy of hallData
    const bookedCustomers = filterHallData
      .filter((ele) => ele.ifBooked)
      .map((ele) => ele.customerName);
    const countTable = {};
  
    for (let i = 0; i < bookedCustomers.length; i++) {
      if (countTable[bookedCustomers[i]]) {
        countTable[bookedCustomers[i]] += 1;
      } else {
        countTable[bookedCustomers[i]] = 1;
      }
    }
  
    console.log("Customer booking count:", countTable);
    res.send(countTable);
  });
  
//listen to the server
app.listen(PORT, () => console.log("woriking"));


}
})
