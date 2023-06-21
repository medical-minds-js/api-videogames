const { model, Schema } = require('mongoose');

const videogameSchema = new Schema({
    name: { type: String },
    description: { type: String },
    developer:{ 
        _id: { type: Schema.Types.ObjectId, ref: 'developers'}, 
        name: { type: String } 
    },
    year: { type: String },
    console: [{
        _id: { type: Schema.Types.ObjectId, ref: 'consoles'}, 
        name: { type: String }
    }],
    image: { type: String  },
    isActive: { type: Boolean }
});

module.exports = model('videogames', videogameSchema);
