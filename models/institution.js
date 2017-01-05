var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var instSchema = new Schema({
    name: {type: String, require: "Institution Name is required"},
    location: {type: String, require: "The Location of the Institution is Required "},
    shortName: {type: String, unique: true, required: "The Name of the Institution must be shortened"}
});

var Institution = mongoose.model('Institution', instSchema);

module.exports = Institution ;
