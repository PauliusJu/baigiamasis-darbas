import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const isValidLithuanianPersonalCode = (code) => {
    if (!/^\d{11}$/.test(code)) {
        console.log('Klaida: Kodas nėra sudarytas iš 11 skaitmenų');
        return false;
    }

    const weights1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    const weights2 = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3];

    const digits = code.split('').map(Number);
    const checksum = digits[10];

    const sum1 = digits.slice(0, 10).reduce((acc, digit, index) => acc + digit * weights1[index], 0);
    let calculatedChecksum = sum1 % 11;

    if (calculatedChecksum === 10) {
        const sum2 = digits.slice(0, 10).reduce((acc, digit, index) => acc + digit * weights2[index], 0);
        calculatedChecksum = sum2 % 11;
    }

    if (calculatedChecksum === 10) {
        calculatedChecksum = 0;
    }

    if (calculatedChecksum !== checksum) {
        console.log(`Klaida: Kontrolinė suma neteisinga. Tikėtina: ${calculatedChecksum}, Įvesta: ${checksum}`);
        return false;
    }

    return true;
};

const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('passportPhoto', file);

    try {
        const response = await axios.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.filePath;
    } catch (err) {
        console.error('Klaida įkeliant failą:', err);
        throw err;
    }
};

const CreateAccount = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const personalCode = formData.get('personalCode');
        const file = formData.get('passportPhoto');

        console.log('Įvestas asmens kodas:', personalCode);

        if (!isValidLithuanianPersonalCode(personalCode)) {
            console.log('Patikrinimo klaida: neteisingas kodas');
            setAlert({ message: 'Neteisingas asmens kodas!', status: 'danger' });
            return;
        }

        try {
            const uploadedFilePath = await handleFileUpload(file);
            formData.set('passportPhoto', uploadedFilePath);

            await axios.post('/api/account', Object.fromEntries(formData));
            navigate('/');
        } catch (err) {
            console.log('Klaida siunčiant duomenis:', err);
            setAlert({ message: 'Klaida įkeliant arba siunčiant duomenis', status: 'danger' });
        }
    };

    return (
        <div>
            <h1>Naujos sąskaitos sukūrimas</h1>
            {alert.message && <div className={`mt-4 alert alert-${alert.status}`}>{alert.message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Vardas:</label>
                    <input type="text" className="form-control" name="firstName" required />
                </div>
                <div className="mb-3">
                    <label>Pavardė:</label>
                    <input type="text" className="form-control" name="lastName" required />
                </div>
                <div className="mb-3">
                    <label>Asmens kodas:</label>
                    <input type="text" className="form-control" name="personalCode" required />
                </div>
                <div className="mb-3">
                    <label>Paso nuotrauka:</label>
                    <input type="file" className="form-control" name="passportPhoto" required />
                </div>
                <button className="btn btn-primary">Talpinti</button>
            </form>
        </div>
    );
};

export default CreateAccount;
