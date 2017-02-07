var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var info = require('./info');
var mongoosePaginate = require('mongoose-paginate');

var infoSchema = new Schema({
    medium: { type: String, required: "Medium Type is required " },
    level: { type: String, required: "Level is Required " },
    year: { type: Number }
}, { _id: false });

var applicationSchema = new Schema({

});

var jobSchema = new Schema({
    institution: { type: String },
    subjects: [{ type: String }],
    days: [{
        type: String,
        enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }],
    info: infoSchema,
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: "There cannot be a Job without the creator." },
    thana: { type: String, require: "Thana is Required for a Tuition Creation" },
    zone: { type: String, required: "Zone Name is required for Thana Creation " },
    applicants: [{
        salary: { type: Number },
        applicant: { type: Schema.Types.ObjectId , ref:'User'},
        _id: false,
    }],
    selected: [{
        salary: { type: Number },
        applicant: { type: Schema.Types.ObjectId , ref:'User'},
        _id: false,
    }],
});

infoSchema.pre('validate', function (next) {
    console.log('Validation of Data');
    var mList = info.getMediums();
    var Llist = info.getLevels(this.medium);
    if (mList.indexOf(this.medium) == -1) {
        return next(Error('Medium Does not Exists '));
    }
    if (Llist.indexOf(this.level) == -1) {
        return next(Error('Level Does not Exists '));
    }
    next();
});

jobSchema.plugin(mongoosePaginate);
var Job = mongoose.model('Job', jobSchema);

module.exports = Job;
