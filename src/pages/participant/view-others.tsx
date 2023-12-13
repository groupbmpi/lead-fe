import NavbarParticipant from '@/components/Navbar/NavbarParticipant';
import Head from 'next/head';
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
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    type LabelValuePairProps = {
        label: string;
        value: string;
    };

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
            <NavbarParticipant />
            <div className="participant-list-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <div className="participant-list" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{marginBottom: '20px' }}>Participant List</h1>
                    <div className="participant-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
                        {participant.map((participant) => (
                            <div key={participant.participant_id} style={{ width: '600px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff', transition: 'box-shadow 0.3s ease', display: 'flex', flexDirection: 'column' }} className="participant-card">
                                <h3 style={{ marginBottom: '10px' }}>{participant.name}</h3>
                                <LabelValuePair label="Email" value={participant.email} />
                                <LabelValuePair label="Instansi" value={participant.instanceName} />
                                <LabelValuePair label="Posisi" value={participant.position} />
                                <LabelValuePair label="Pendidikan Terakhir" value={participant.latest_education} />
                                <LabelValuePair label="Jurusan Pendidikan Terakhir" value={participant.education_background} />
                                <LabelValuePair label="Fokus Isu" value={participant.focus} />
                                <LabelValuePair label="No. Telepon" value={participant.whatsapp_number} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ParticipantListPage;
