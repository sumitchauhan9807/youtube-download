const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 
const ArtistSchema = new Schema({
  user:{ type: Schema.Types.ObjectId, ref: 'User',required:true },
  tracks:[{
    type: Schema.Types.ObjectId, ref: 'Track'
  }],
  name:{
    type:String,
    required:true
  },
});
const artistModel = mongoose.model('Artist', ArtistSchema);

module.exports  = artistModel