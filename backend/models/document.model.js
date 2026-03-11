const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  title: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  uploadRequired: {
    type: Boolean,
    default: false
  },
  isRelated: {
    type: Boolean,
    default: false
  },
  hasDocuments: {
    type: Boolean,
    default: false
  },
  perSite: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false  // ← Soft delete!
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);