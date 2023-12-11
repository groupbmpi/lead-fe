import NavbarGuest from '@/components/Navbar/NavbarGuest'
import { redirectLoggedInUser } from '@/utils/auth';
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Alert, Button, Modal } from 'react-bootstrap'

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ParticipantSetPassword() {
    useEffect(() => {
        redirectLoggedInUser();
    });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

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
                setError('Panjang kata sandi minimal 8 karakter!');
                setShow(true)
                return;
            }
            if (password !== confirmPassword) {
                setError('Kata sandi tidak sama!');
                setShow(true)
                return;
            }
            try {
                const response = await fetch(`${backendUrl}/api/v1/participant?email=${email}`);

                if (response.ok) {
                    const res = await response.json();
                    const participantId = res.data.participant_id;
                    try {
                        const response = await fetch(`${backendUrl}/api/v1/participant/${participantId}/password/add`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ password }),
                        });
                        if (response.ok) {
                            const res = await response.json();
                            setEmail('');
                            setPassword('');
                            setConfirmPassword('');
                            setModalContent(res.message);
                            setShowModal(true);
                        } else {
                            const res = await response.json();
                            setModalContent(res.message);
                            setShowModal(true);
                        }

                    } catch (error) {
                        setModalContent("Unknown Error");
                        setShowModal(true);
                    }
                } else {
                    const res = await response.json();
                    setModalContent(res.message);
                    setShowModal(true);
                }
            } catch (error) {
                setModalContent("Unknown Error");
                setShowModal(true);
            }

        } catch (error) {
            setModalContent("Unknown Error");
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
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
                            <input type="email" className="form-control mb-3" name="email" value={email} onChange={handleChange} required />
                            <label className="form-label">Kata Sandi</label>
                            <input type="password" className="form-control mb-3" name="password" value={password} onChange={handleChange} required />
                            <label className="form-label">Ulangi Kata Sandi</label>
                            <input type="password" className="form-control" name="confirmPassword" value={confirmPassword} onChange={handleChange} required />
                            <div className="form-text mb-4">
                                Panjang kata sandi minimal 8 karakter!
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary w-50">Simpan</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Buat Kata Sandi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalContent ? (
                        <>
                            <p>{modalContent}</p>
                        </>
                    ) : (
                        <p>Unknown Error</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
