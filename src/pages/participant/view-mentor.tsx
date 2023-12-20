import NavbarParticipant from '@/components/Navbar/NavbarParticipant';
import { checkAuth } from '@/utils/auth';
import Head from 'next/head';
import router from 'next/router';
import React, { useState, useEffect } from 'react';

interface Mentor {
    mentor_id: string;
    name: string;
    email: string;
    category: string;
    birthdate: string;
    gender: string;
    phone_number: string;
    education_background: string;
    current_workplace: string;
    position: string;
}

const MentorListPage = () => {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [allowed, setAllowed] = useState(false);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    type LabelValuePairProps = {
        label: string;
        value: string;
    };

    useEffect(() => {
        const checkAuthentication = async () => {
          const isAllowed = await checkAuth(['PARTICIPANT']);
          setAllowed(isAllowed);
    
          if (!isAllowed) {
            router.push('/participant-login');
          }
        };
        checkAuthentication();
    });
    
    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/v1/mentor`, {
                    credentials: 'include',
                });

                if (response.ok) {
                    const res = await response.json();
                    console.log(res.data); 
                    setMentors(res.data?.mentors || []); 
                } else {
                    console.error('Error fetching mentors:', response.status);
                }
            } catch (error) {
                console.error('Error fetching mentors:', error);
            }
        };

        fetchMentors();
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
                <title>LEAD - Lihat Daftar Mentor</title>
            </Head>
            {allowed && <NavbarParticipant />}
            <NavbarParticipant/>
            <div className="mentor-list-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <div className="mentor-list" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{marginBottom: '20px' }}>Mentor List</h1>
                    <div className="mentor-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
                        {mentors.map((mentor) => (
                            <div key={mentor.mentor_id} style={{ width: '600px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff', transition: 'box-shadow 0.3s ease', display: 'flex', flexDirection: 'column' }} className="mentor-card">
                                <h3 style={{ marginBottom: '10px' }}>{mentor.name}</h3>
                                <LabelValuePair label="Email" value={mentor.email} />
                                <LabelValuePair label="Tanggal Lahir" value={mentor.birthdate} />
                                <LabelValuePair label="Instansi" value={mentor.current_workplace} />
                                <LabelValuePair label="Posisi" value={mentor.position} />
                                <LabelValuePair label="Pendidikan Terakhir" value={mentor.education_background} />
                                <LabelValuePair label="Kategori" value={mentor.category} />
                                <LabelValuePair label="Gender" value={mentor.gender} />
                                <LabelValuePair label="No. Telepon" value={mentor.phone_number} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MentorListPage;
