const express = require('express');
require('dotenv').config();
const logger = require('morgan');
const cors = require('cors');
require('./entity/environment-validation');

const routes = require('./router.js');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.use('/api/events', routes);

module.exports = app;