import mongoose from 'mongoose';

const cipherSchema = new mongoose.Schema(
  {
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
      trim: true
    },
    secretMessage: {
      type: String,
      required: true
    },
    keyName: {
      type: String,
      required: true
    },
    features: {
      type: [String],
      required: true
    },
    riddle: {
      type: String,
      required: true
    },
    solved: {
      type: Boolean,
      default: false
    },
    fingerprint: {
      type: Object,
      required: false
    }
  },
  {
    timestamps: true
  }
);

const Cipher = mongoose.models.Cipher || mongoose.model('Cipher', cipherSchema);

export default Cipher;
