import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { extractFormData } from '../helpers/util.js';

const DeductFunds = () => {
    const [data, setData] = useState({});
    const [alert, setAlert] = useState({});
    const [balance, setBalance] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        axios.get(`/api/account/${id}`)
        .then(resp => setData(resp.data))
        .catch(err => setAlert({ message: err.response.data, status: 'danger' }));
    }, [id]);

    const handleInputChange = (e) => {
        let value = e.target.value.replace(',', '.');
        if (value === '' || /^[0-9]*(\.[0-9]{0,2})?$/.test(value)) {
            setBalance(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = extractFormData(e.target);
        const newBalance = parseFloat(data.accountsBalance) - parseFloat(formData.accountsBalance);
        const updatedData = { ...formData, accountsBalance: Math.max(0, newBalance) };

        axios.put(`/api/account/${id}`, updatedData)
        .then(() => navigate('/'))
        .catch(err => setAlert({ message: err.response.data, status: 'danger' }));
    };

    return (
        <div className="container">
            <h1 className="text-danger">Lėšų nuskaitymas</h1>
            {alert.message && <div className={`mt-4 alert alert-${alert.status}`}>{alert.message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input type="text" className="form-control" name="accountsBalance" onInput={handleInputChange} value={balance} required />
                    <button className="btn btn-warning">Nuskaičiuoti</button>
                </div>
            </form>
        </div>
    );
};

export default DeductFunds;
