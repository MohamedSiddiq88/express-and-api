//impot fs , express 
// const fs = require("fs");
// const express = require("express");
// const { error } = require("console");
import express from "express";
import fs from "fs";
import {error} from "console";

//intialize the express
const app = express();
app.use(express.json())

//create hallData
let hallData = [];


fs.get("/",(req,res)=>{
    res.send("welcome")
})

//use json data
fs.readFile("./hallData.json","utf-8", (error, data) => {
    if (error) {
        console.log(error);
    } else {
        hallData = JSON.parse(data);
    }
})

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


//list all room with booked data 
app.get("/hall-ticket/booked-room", (req, res) => {
    let filterHallData = hallData;
    filterHallData=filterHallData.filter((ele) => ele.ifBooked == true);
    filterHallData=filterHallData.map((ele)=>ele.RoomName);
    console.log("list of all booked Room ",filterHallData);
    res.send(filterHallData);
})

//list all customer with booked data
app.get("/hall-ticket/customer", (req, res) => {
    let filterHallData = hallData;
    filterHallData=filterHallData.filter((ele) => ele.ifBooked == true);
    filterHallData=filterHallData.map((ele)=>ele.customerName);
    console.log("list of all coutomer who booked room",filterHallData);
    res.send(filterHallData);
})


//list how many times customer has booked room
app.get("/hall-ticket/costomer-count", (req, res) => {
    let filterHallData = hallData;
    filterHallData=filterHallData.filter((ele) => ele.ifBooked == true);
    let nameArray=filterHallData.map((ele)=>ele.customerName);

    //frequency of ostmer name
    let table={};
    for(let i=0;i<nameArray.length;i++){
        table[nameArray[i]]=0;
    }
    for(let i=0;i<nameArray.length;i++){
        table[nameArray[i]]++;
    }

    console.log("customer booking count",table);
    res.send(table);
})

//listen to the server
app.listen(9000, () => console.log("woriking"));



