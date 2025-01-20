import { useState } from 'react'; 
import axios from 'axios';
import { extractFormData } from '../helpers/util.js';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [alert, setAlert] = useState({});
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = extractFormData(e.target);

        axios.post('/api/user/login', data)
        .then(resp => {
            setUser(resp.data);
            navigate('/'); 
        })
        .catch(err => {
            setAlert({ message: err.response?.data, status: 'danger' });
        });
    };

    return (
        <div>
            <h1>Prisijungimo forma</h1>
            {alert.message && <div className={`alert alert-${alert.status}`}>{alert.message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Prisijungimo vardas:</label>
                    <input type="text" className="form-control" name="login" required />
                </div>
                <div className="mb-3">
                    <label>Slaptažodis:</label>
                    <input type="password" className="form-control" name="password" required />
                </div>
                <button className="btn btn-primary">Prisijungti</button>
            </form>
        </div>
    );
};

export default Login;
