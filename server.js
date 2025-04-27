const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  //console.log(err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => {
  //console.log(con.connections);
  console.log('connect to db');
});

//console.log(process.env);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('running');
});

process.on('unhandledRejection', (err) => {
  server.close(() => {
    process.exit(1);
  });
});
