import { Schema, model } from 'mongoose';

const generateAccountNumber = () => 'LT12' + Math.random().toString().slice(2, 18);

export default model('Accounts', new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    accountNumber: { type: String, required: true, default: generateAccountNumber },
    personalCode: { type: Number, required: true },
    passportPhoto: { type: String, required: true },
    accountsBalance: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}));

