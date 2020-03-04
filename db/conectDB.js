const mongoose = require('mongoose');
const { DB_HOSTNAME, DB_PORT, DB_NAME } = process.env;
const url = `mongodb://${DB_HOSTNAME}:${DB_PORT}/${DB_NAME}`;

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('db connected!');
});

module.export = mongoose;
