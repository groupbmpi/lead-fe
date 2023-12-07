import NavbarGuest from '@/components/Navbar/NavbarGuest'
import Head from 'next/head'
import { useState } from 'react'
import { Alert } from 'react-bootstrap'

export default function ParticipantSetPassword() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [show, setShow] = useState(false);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        switch (name) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            default:
                break;
        }
    };

    const handleFormSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            if (password.length < 8 || confirmPassword.length < 8) {
                setError('Password must be at least 8 characters long!');
                setShow(true)
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match!');
                setShow(true)
                return;
            }
            // create password

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Head>
                <title>LEAD - Buat Kata Sandi</title>
            </Head>
            <div className="d-flex flex-column min-vh-100">
                <NavbarGuest />
                <div className="container-fluid align-items-center justify-content-center d-flex flex-column flex-grow-1">
                    <h1 className="mb-3">Buat Kata Sandi</h1>
                    {show && <Alert className="col-sm-6 col-10" onClose={() => setShow(false)} dismissible variant="danger">{error}</Alert>}
                    <form onSubmit={handleFormSubmit} className="col-sm-6 col-10">
                        <div className="d-flex flex-column">
                            <label className="form-label">Email Peserta</label>
                            <input type="email" className="form-control mb-3" name="email" value={email} onChange={handleChange} />
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control mb-3" name="password" value={password} onChange={handleChange} />
                            <label className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" name="confirmPassword" value={confirmPassword} onChange={handleChange} />
                            <div className="form-text mb-4">
                                Your password must be at least 8 characters long
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary w-50">Simpan</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
