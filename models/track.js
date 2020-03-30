const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 
const TrackSchema = new Schema({
  user:{ type: Schema.Types.ObjectId, ref: 'User',required:true },
  artist:{type: Schema.Types.ObjectId, ref: 'Artist',required:true },
  videoId:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  }, 
});
const trackModel = mongoose.model('Track', TrackSchema);

module.exports  = trackModel