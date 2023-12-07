const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');

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


const app = express();

app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('views/home')
})

app.get('/campground', async (req, res) => {
    const camp = new Campground({title: 'My Backyard', description: 'Cheap Camping'})
    await camp.save();
    res.send(camp);
})

app.listen(3000, () =>{
    console.log("Serving on port 3000");
})