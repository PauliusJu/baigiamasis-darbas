import { Schema, model } from 'mongoose';

export default model('Users', new Schema({
    login: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}));

