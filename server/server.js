import express from 'express';
import mongoose from 'mongoose';
import account from './controller/account.js';
import user from './controller/user.js';
import session from 'express-session';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();

try {
    await mongoose.connect('mongodb://127.0.0.1:27017/virtualus-bankas');
    app.listen(3000);
    console.log('Veikia');
} catch {
    console.log('Neveikia');
}

app.set('trust proxy', 1);
app.use(session({
    secret: 'Slapta unikali frazė',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: path.resolve('uploads'), 
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('passportPhoto'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Failas neįkeltas' });
    }
    res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

app.use('/uploads', express.static(path.resolve('uploads')));

app.use('/api/account', account);
app.use('/api/user', user);