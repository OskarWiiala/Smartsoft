// The main back-end app file

'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('./utils/pass');
const rootRoute = require('./routes/rootRoute');
const foodPostRoute = require('./routes/foodPostRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const ratingRoute = require('./routes/ratingRoute');
const app = express();
const port = 3000;

app.use(cors());

// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// app uses the uploads folder
app.use(express.static('uploads'));
// app uses the thumbnails folder
app.use('/thumbnails', express.static('thumbnails'));
// app uses the front-end folder, used to assign the rootRoute to the front-end index.html
app.use(express.static('front-end'));

// https features depending on whether the app is in development or production environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'production') {
  require('./production')(app, process.env.PORT);
} else {
  require('./localhost')(app, process.env.HTTPS_PORT, process.env.HTTP_PORT);
}

// routes
app.use('/', rootRoute);
app.use('/auth', authRoute);
app.use('/foodPost', foodPostRoute);
app.use('/rating', ratingRoute);
// user route requires authentication in all of its methods
app.use('/user', passport.authenticate('jwt', {session: false}), userRoute);