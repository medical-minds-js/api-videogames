const {model, Schema} = require('mongoose');

const consoleSchema = new Schema({
  name: String
});


module.exports = model('consoles', consoleSchema);
