import NavbarMentor from '@/components/Navbar/NavbarMentor';
import { useRegistration } from '@/contexts/RegistrationContext';
import { checkAuth, getId } from '@/utils/auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const MentorProfileView = () => {
    const router = useRouter();
    const id = getId();
    const { userData, setUserData } = useRegistration();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [displayedImage, setDisplayedImage] = useState<string | null>(null);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [allowed, setAllowed] = useState(false);
    useEffect(() => {
        const checkAuthentication = async () => {
            const isAllowed = await checkAuth(['MENTOR']);
            setAllowed(isAllowed);

            if (!isAllowed) {
                router.push('/mentor-login');
            }
        };
        checkAuthentication();
    });

    useEffect(() => {
        if (selectedImage) {
            const reader = new FileReader();
            reader.onload = () => {
                setDisplayedImage(reader.result as string);
            };
            reader.readAsDataURL(selectedImage);
        }
    }, [selectedImage]);

    useEffect(() => {
        const fetchMentorData = async () => {
          try {
            const response = await fetch(`${backendUrl}/api/v1/mentor/${id}`, {
              credentials: 'include',
            });
                if (response.ok) {
                    const res = await response.json();
                    const mentorData = (res.data);
                    setUserData(mentorData);
                }
            } catch (error) {
                console.error('Error fetching mentor data:', error);
            }
        };
    
        fetchMentorData();
    }, [id]);

    const handleBack = () => {
        router.push('/mentor/profile');
    };

    type LabelValuePairProps = {
        label: string;
        value: string;
    };

    const LabelValuePair = ({ label, value }: LabelValuePairProps) => (
        <p style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginBottom: '10px' }}>
            <span style={{ flex: '0 0 100%', fontWeight: 'bold' }}>{label}</span>
            <span style={{ flex: '0 0 100%' }}>{value}</span>
        </p>
    );

    if (!userData) {
        router.push('/mentor/profile');
        return null;
    }
    
    return (
        <>
            <Head>
                <title>LEAD - Profile Mentor</title>
            </Head>
            {allowed && <NavbarMentor />}
            <div className="d-flex flex-column min-vh-100 align-items-center">
                <div className="container mt-3 mb-3">
                    <div className="d-flex justify-content-between align-items-start">
                        <div className="div className=d-flex flex-column gap-3 align-items-start" style={{ width: '20%', marginTop: '30px'}}>
                            <LabelValuePair label="Email" value={userData.email} />
                            <LabelValuePair label="Tanggal Lahir" value={userData.birthdate} />
                            <LabelValuePair label="No. Handphone" value={userData.phone_number} />
                            <LabelValuePair label="Gender" value={userData.gender} />
                            <LabelValuePair label="Pendidikan Terakhir" value={userData.education_background} />
                            <LabelValuePair label="Kategori" value={userData.category} />
                        </div>
                        <div className="position-relative">
                        {userData.url_picture ? (
                            <div className="rounded-circle border" style={{ width: '200px', height: '200px', overflow: 'hidden' }}>
                                <img
                                    src={userData.url_picture}
                                    alt="Uploaded"
                                    className="img-fluid"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center center', 
                                        borderRadius: '50%', 
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="rounded-circle border" style={{ width: '200px', height: '200px', overflow: 'hidden' }}>
                                <img
                                    src="/logo/lead-white-background.png"
                                    alt="Uploaded"
                                    className="img-fluid"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center center', 
                                        borderRadius: '50%', 
                                    }}
                                />
                            </div>
                        )}
                        <h5 style={{ textAlign: 'center', padding: '10px' }}><b>{userData.name}</b></h5>
                        <p style={{ textAlign: 'center' }}>{userData.current_workplace}</p>
                        <p style={{ textAlign: 'center' }}>{userData.position}</p>
                        </div>
                    </div>
                </div>
                <button onClick={handleBack} className="btn btn-primary" style={{ width: '100px' }}>
                    Ubah
                </button>
            </div>
        </>
    );
};

export default MentorProfileView;
