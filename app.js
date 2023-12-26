const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const engine = require('ejs-mate');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/Express-Error');


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

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', catchAsync( async (req, res) => {
    const Campgrounds = await Campground.find({});
    res.render('campgrounds/index', {Campgrounds});
}))

app.get('/campgrounds/new', (req, res) =>{
    res.render('campgrounds/new');
})

app.post('/campgrounds', catchAsync(async (req, res) => {
    if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    // res.send(req.body);
    await campground.save();
    // res.redirect(`/campground/${campground._id}`);
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {campground});
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
}))

app.put('/campgrounds/:id', catchAsync(async (req, res) =>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new:true});
    res.redirect(`/campgrounds/${camp._id}`);
}))

app.delete('/campgrounds/:id', catchAsync (async (req, res) =>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Note Found', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Oh no, Something Went Wrong!';
    res.status(statusCode).render('error' , {err});
});

app.listen(3000, () =>{
    console.log("Serving on port 3000");
})