import NavbarAdmin from '@/components/Navbar/NavbarAdmin';
import { Modal, Button } from 'react-bootstrap'
import Head from 'next/head';
import Link from 'next/link';
import router from 'next/router';
import React, { useState, useEffect } from 'react';

interface Participant {
    instanceName: string;
    participant_id: string;
    name: string;
    email: string;
    position: string;
    latest_education: string;
    education_background: string;
    focus: string;
    whatsapp_number: string;
}

const ParticipantListPage = () => {
    const [participant, setParticipants] = useState<Participant[]>([]);
    const [allowed, setAllowed] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<Participant | null>(null);
    const [participantToDelete, setParticipantToDelete] = useState<string>('');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    type LabelValuePairProps = {
        label: string;
        value: string;
    };

    // useEffect(() => {
    //     const checkAuthentication = async () => {
    //       const isAllowed = await checkAuth(['ADMIN']);
    //       setAllowed(isAllowed);
    
    //       if (!isAllowed) {
    //         router.push('/admin-login');
    //       }
    //     };
    //     checkAuthentication();
    // });

    useEffect(() => {
        const fetchParticipant = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/v1/participant`, {
                    credentials: 'include',
                });
    
                if (response.ok) {
                    const res = await response.json();
                    console.log(res.data);
                    const participantsData = res.data?.participants || [];
                    
                    const participantsWithInstanceName = await Promise.all(participantsData.map(async (participant: { instance_id: any; }) => {
                        const instanceResponse = await fetch(`${backendUrl}/api/v1/instance/${participant.instance_id}`, {
                            credentials: 'include',
                        });
    
                        if (instanceResponse.ok) {
                            const instanceRes = await instanceResponse.json();
                            const instanceName = instanceRes.data?.name || 'Unknown';
                            return { ...participant, instanceName };
                        } else {
                            console.error('Error fetching instance for participant:', instanceResponse.status);
                            return participant;
                        }
                    }));
                    
                    setParticipants(participantsWithInstanceName);
                } else {
                    console.error('Error fetching participants:', response.status);
                }
            } catch (error) {
                console.error('Error fetching participants:', error);
            }
        };
    
        fetchParticipant();
    }, [backendUrl]);
    
    const handleEdit = async (participantId: string) => {
        router.push(`/admin/edit-participant/${participantId}`);
    }
        
    const handleDelete = async (participantId: string) => {
        console.log("Delete button clicked");
        const participantToDelete = participant.find(p => p.participant_id === participantId);
        setModalContent(participantToDelete || null);
        setShowModal(true);
        try {
            const response = await fetch(`${backendUrl}/api/v1/participant/${participantId}`, {
                credentials: 'include',
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        
            if (response.ok) {
                console.log(`Participant with ID ${participantId} deleted successfully`);
            } else {
                console.error('Failed to delete participant');
            }
        } catch (error) {
            console.error('Error deleting participant:', error);
        }
    };


    const confirmDelete = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/v1/participant/${participantToDelete}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        
            if (response.ok) {
                console.log(`Participant with ID ${participantToDelete} deleted successfully`);
                const updatedParticipants = participant.filter(p => p.participant_id !== participantToDelete);
                setParticipants(updatedParticipants);
            } else {
                console.error('Failed to delete participant');
            }
        } catch (error) {
            console.error('Error deleting participant:', error);
        }
        setShowModal(false);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const LabelValuePair = ({ label, value }: LabelValuePairProps) => (
        <p style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flex: '0 0 45%', fontWeight: 'bold' }}>{label}</span>
          <span style={{ flex: '0 0 50%' }}>: {value}</span>
        </p>
    );

    return (
        <>
            <Head>
                <title>LEAD - Lihat Daftar Peserta</title>
            </Head>
            <NavbarAdmin />
            {/* {allowed && <NavbarAdmin />} */}
            <div className="participant-list-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <div className="participant-list" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{marginBottom: '20px' }}>Daftar Peserta</h1>
                    <div className="participant-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
                    {participant.map((participant) => (
                        <Link key={participant.participant_id} href={`/admin/view-participant/${participant.participant_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div key={participant.participant_id} style={{ width: '600px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff', transition: 'box-shadow 0.3s ease', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', }} className="mentor-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <h3>{participant.name}</h3>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button className="btn btn-primary" onClick={(e) => {
                                            e.preventDefault();
                                            handleEdit(participant.participant_id);
                                        }}>Edit</button>                                            
                                        <button className="btn btn-danger" onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete(participant.participant_id);
                                        }}>Delete</button>
                                    </div>
                                </div>
                                <LabelValuePair label="Id" value={participant.participant_id} />
                                <LabelValuePair label="Email" value={participant.email} />
                                <LabelValuePair label="Instansi" value={participant.instanceName} />
                            </div>
                        </Link>
                    ))}
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={closeModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Apakah anda yakin ingin menghapus peserta?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalContent ? (
                        <>
                            <p>Nama Peserta: {modalContent.name}</p>
                            <p>Email Peserta: {modalContent.email}</p>
                        </>
                    ) : (
                        <p>Data dengan email tersebut tidak ditemukan</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ParticipantListPage;
