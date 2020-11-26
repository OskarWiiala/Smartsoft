'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('./utils/pass');
const rootRoute = require('./routes/rootRoute');
const foodPostRoute = require('./routes/foodPostRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const app = express();
const port = 3000;


app.use(cors());

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.use(express.static('uploads'));
app.use('/thumbnails', express.static('thumbnails'));

// routes
app.use('/', rootRoute);
app.use('/auth', authRoute);
// app.use('/foodPost', passport.authenticate('jwt', {session: false}), foodPostRoute);
app.use('/user', passport.authenticate('jwt', {session: false}), userRoute);

// app.use('/user', userRoute);
app.use('/foodPost', foodPostRoute);

app.listen(port, () => console.log(`Smartsoft web app listening on port ${port}!`));