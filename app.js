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

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.use(express.static('uploads'));
app.use('/thumbnails', express.static('thumbnails'));

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
app.use('/user', passport.authenticate('jwt', {session: false}), userRoute);

//app.listen(port, () => console.log(`Smartsoft web app listening on port ${port}!`));