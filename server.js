const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');

const connectDB = require('./config/db')
// Load env filds
dotenv.config({ path: './config/config.env' });

// Connect to DB
connectDB();

const app = express();
app.use(express.json())

//  Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//  Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

//  Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.rainbow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //  Close server and exit process
  server.close(() => process.exit(1))
})