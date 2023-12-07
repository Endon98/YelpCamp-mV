const cities = require('../cities');
const express = require('express');
const {places, descriptors} = require('./seedHelpers');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('../models/campground');

main()
.then(()=>{console.log("MONGO CONNECTION OPEN!!!")})
.catch(err => {
    console.log("OH NO MONGO CONNECTION ERROR!")
    console.log(err)});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once("open", ()=>{
    console.log("Database connected");
});


const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i = 0; i < 1000; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)}, ${sample(places)}`

        })
        await camp.save();
    }

    const c = new Campground({title:"Purple Fields"});
    await c.save();
}


seedDB().then(()=>{
    mongoose.connection.close();
    console.log("Database closed!")
});

