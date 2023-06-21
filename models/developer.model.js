const {model, Schema} = require('mongoose');

const developerSchema = new Schema({
  name: String
})


module.exports = model('developers', developerSchema);