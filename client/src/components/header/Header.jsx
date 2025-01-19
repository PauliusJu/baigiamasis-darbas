import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = ({ user, setUser }) => {
    const handleLogout = () => {
        axios.get('/api/user/logout').then(() => setUser(false));
    };

    return (
        <header className="bg-dark text-white py-3 shadow-lg">
            <div className="container d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                    <Link to="/" className="text-white text-decoration-none d-flex align-items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-bar-chart-line-fill" viewBox="0 0 16 16">
                            <path d="M11 1a1 1 0 0 1 1 1v11h1V2a2 2 0 0 0-2-2h-1v1h1zM8 6a1 1 0 0 1 1-1h1v7h1V5a2 2 0 0 0-2-2H8v3zM5 9a1 1 0 0 1 1-1h1v4h1v-4a2 2 0 0 0-2-2H5v3zM2 12a1 1 0 0 1 1-1h1v2h1v-2a2 2 0 0 0-2-2H2v3z"/>
                        </svg>
                        <span className="fs-4 fw-bold">Turbo Bankas</span>
                    </Link>
                    {user && <span className="badge bg-primary fs-6">Viršininkas: {user.login}</span>}
                </div>
                <nav className="d-flex gap-3">
                    {user ? (
                        <>
                            <Link to="/create-account" className="btn btn-outline-light btn-sm rounded-pill px-3">
                                Nauja sąskaita
                            </Link>
                            <button onClick={handleLogout} className="btn btn-light btn-sm rounded-pill text-dark px-3">
                                Atsijungti
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-sm rounded-pill px-4">
                            Prisijungti
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
