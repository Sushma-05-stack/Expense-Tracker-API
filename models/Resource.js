const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    default: 'active',
  },
  externalId: {
    type: String, // Used to store the ID returned by the third-party SDK
  },
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
