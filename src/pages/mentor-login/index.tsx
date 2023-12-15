import NavbarGuest from '@/components/Navbar/NavbarGuest';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import cookies from 'js-cookie';
import router from 'next/router';
import { redirectLoggedInUser } from '@/utils/auth';

export default function ParticipantLogin() {
    useEffect(() => {
        redirectLoggedInUser();
    });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [show, setShow] = useState(false);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        switch (name) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }
    };

    const handleFormSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await fetch(`${backendUrl}/api/v1/mentor/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            if (response.ok) {
                const res = await response.json();
                cookies.set('token-fe', res.data.token, { path: '/', secure: process.env.NODE_ENV === 'production' });
                router.push('/mentor/dashboard');
            } else {
                const errorData = await response.json();
                setError(errorData.message);
                setShow(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Head>
                <title>LEAD - Login Mentor</title>
            </Head>
            <div className="d-flex flex-column min-vh-100">
                <NavbarGuest />
                <div className="container-fluid align-items-center justify-content-center d-flex flex-column flex-grow-1">
                    <h1 className="mb-3">Login</h1>
                    <h4 className="mb-3">Mentor</h4>
                    {show && <Alert className="col-sm-6 col-10" onClose={() => setShow(false)} dismissible variant="danger">{error}</Alert>}
                    <form onSubmit={handleFormSubmit} className="col-sm-6 col-10">
                        <div className="d-flex flex-column">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control mb-3" name="email" value={email} onChange={handleChange} required />
                            <label className="form-label">Kata Sandi</label>
                            <input type="password" className="form-control mb-5" name="password" value={password} onChange={handleChange} required />
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary w-50">Masuk</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
