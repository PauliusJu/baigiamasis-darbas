import { Router } from 'express';
import User from '../model/user.js';
import { auth } from '../middleware/auth.js';
import bcrypt from 'bcrypt';

const router = Router();

const encodePassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

router.get('/', async (req, res) => {
    try {
        res.json(await User.find());
    } catch {
        res.status(501).json('Įvyko serverio klaida');
    }
});

router.post('/login', async (req, res) => {
    if (!req.body.login || !req.body.password) {
        return res.status(500).json('Negauti prisijungimo duomenys');
    }

    const user = await User.findOne({ login: req.body.login });

    if (!user || !(await comparePassword(req.body.password, user.password))) {
        return res.status(401).json('Neteisingi prisijungimo duomenys');
    }

    req.session.user = {
        login: user.login,
    };

    res.json(req.session.user);
});

router.get('/check-auth', auth, (req, res) => {
    res.json(req.session.user);
});

router.get('/logout', auth, (req, res) => {
    req.session.destroy();
    res.json("Sėkmingai atsijungėte");
});

router.post('/', async (req, res) => {
    try {
        const { login, password } = req.body;

        const encodedPassword = await encodePassword(password);

        await User.create({ login, password: encodedPassword });
        res.json('Įrašas sėkmingai išsaugotas');
    } catch {
        res.status(501).json('Įvyko serverio klaida');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updates = req.body;

        if (updates.password) {
            updates.password = await encodePassword(updates.password);
        }

        updates.updatedAt = new Date();

        await User.findByIdAndUpdate(req.params.id, updates);
        res.json("Vartotojas sėkmingai atnaujintas");
    } catch {
        res.status(501).json('Įvyko serverio klaida');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json("Vartotojas sėkmingai ištrintas");
    } catch {
        res.status(501).json('Įvyko serverio klaida');
    }
});

export default router;
