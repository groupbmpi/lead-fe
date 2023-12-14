import NavbarAdmin from '@/components/Navbar/NavbarAdmin';
import Head from 'next/head';
import Link from 'next/link';
import router from 'next/router';
import React, { useState, useEffect } from 'react';
import { checkAuth } from '@/utils/auth';

interface Mentor {
    mentor_id: string;
    mentor_id_bcf: string;
    name: string;
    email: string;
    birthdate: string;
    gender: string;
    phone_number: string;
    education_background: string;
    position: string;
    current_workplace: string;
}

const MentorListPage = () => {
    const [mentor, setMentors] = useState<Mentor[]>([]);
    const [allowed, setAllowed] = useState(false);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    type LabelValuePairProps = {
        label: string;
        value: string;
    };

    useEffect(() => {
        const checkAuthentication = async () => {
          const isAllowed = await checkAuth(['ADMIN']);
          setAllowed(isAllowed);
    
          if (!isAllowed) {
            router.push('/admin-login');
          }
        };
        checkAuthentication();
    });

    useEffect(() => {
        const fetchMentor = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/v1/mentor`, {
                    credentials: 'include',
                });
    
                if (response.ok) {
                    const res = await response.json();
                    console.log(res.data);
                    const mentorsData = res.data?.mentors || [];
                    
                    setMentors(mentorsData);
                } else {
                    console.error('Error fetching mentors:', response.status);
                }
            } catch (error) {
                console.error('Error fetching mentors:', error);
            }
        };
    
        fetchMentor();
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
            {allowed && <NavbarAdmin />}
            <div className="participant-list-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <div className="participant-list" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{marginBottom: '20px' }}>Daftar Mentor</h1>
                    <div className="participant-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
                    {mentor.map((mentor) => (
                        <Link key={mentor.mentor_id} href={`/admin/view-mentor/${mentor.mentor_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div key={mentor.mentor_id} style={{ width: '600px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff', transition: 'box-shadow 0.3s ease', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', }} className="mentor-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <h3>{mentor.name}</h3>
                                </div>
                                <LabelValuePair label="Id" value={mentor.mentor_id} />
                                <LabelValuePair label="Id BCF" value={mentor.mentor_id_bcf} />
                                <LabelValuePair label="Email" value={mentor.email} />
                                <LabelValuePair label="Tanggal Lahir" value={mentor.birthdate} />
                                <LabelValuePair label="Gender" value={mentor.gender} />
                                <LabelValuePair label="No. Telepon" value={mentor.phone_number} />
                                <LabelValuePair label="Pendidikan Terakhir" value={mentor.education_background} />
                                <LabelValuePair label="Posisi" value={mentor.position} />
                                <LabelValuePair label="Instansi" value={mentor.current_workplace} />
                            </div>
                        </Link>
                    ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MentorListPage;
