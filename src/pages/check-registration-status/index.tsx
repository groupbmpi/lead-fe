import NavbarGuest from '@/components/Navbar/NavbarGuest'
import Head from 'next/head'
import { SetStateAction, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

interface StatusPendaftaran {
  namaInstansi: string,
  status: string
}

export default function CheckRegistrationStatus() {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<StatusPendaftaran | null>(null);

  const handleEmailChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      // const response = await fetch('/api/getInformation', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email }),
      // });

      // if (response.ok) {
      //   const data = await response.json();
      //   setModalContent(data);
      //   setShowModal(true);
      // } else {
      //   // Handle error
      // }
      const data = {
        namaInstansi: "Instansi",
        status: "Lolos"
      }
      setModalContent(data);
      setShowModal(true)

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <Head>
        <title>LEAD - Cek Status Registrasi</title>
      </Head>
      <div className="d-flex flex-column min-vh-100">
        <NavbarGuest />
        <div className="container-fluid w-sm-50 w-100 align-items-center text-center justify-content-center d-flex flex-column flex-grow-1">
          <h1>Cek Status Registrasi</h1>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" value={email} onChange={handleEmailChange} />
              <div className="form-text mb-4">
                <span>Masukkan email address yang digunakan saat pendaftaran</span>
              </div>
              <button type="submit" className="btn btn-primary w-50">Cek</button>
            </div>
          </form>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Status Pendaftaran</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContent ? (
            <>
              <p>Nama Instansi: {modalContent.namaInstansi}</p>
              <p>Status Pendaftaran: {modalContent.status}</p>
            </>
          ) : (
            <p>Data dengan email tersebut tidak ditemukan</p>
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
