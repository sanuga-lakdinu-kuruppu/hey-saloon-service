import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  clientId: {
    type: String,
  },
  connectionId: {
    type: String,
  },
  isConnected: {
    type: Boolean,
  },
});

export const Connection = mongoose.model("Connection", connectionSchema);
