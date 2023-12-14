import NavbarMentor from '@/components/Navbar/NavbarMentor';
import { useRegistration } from '@/contexts/RegistrationContext';
import { getEmail, getUserName, getMentorCategory, checkAuth } from '@/utils/auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const MentorProfileView = () => {
    const router = useRouter();
    const { userData } = useRegistration();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [displayedImage, setDisplayedImage] = useState<string | null>(null);
    const email = getEmail();
    const userName = getUserName();
    const mentorCategory = getMentorCategory();

    const [allowed, setAllowed] = useState(false);
    useEffect(() => {
        const checkAuthentication = async () => {
            const isAllowed = await checkAuth(['MENTOR']);
            setAllowed(isAllowed);

            // if (!isAllowed) {
            //     router.push('/mentor-login');
            // }
        };
        checkAuthentication();
    });
    useEffect(() => {
        if (!userData || Object.keys(userData).length === 0) {
            router.push('/mentor/profile');
        }
        if (userData.image !== displayedImage) {
            setDisplayedImage(userData.image);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData, router]);

    useEffect(() => {
        if (selectedImage) {
            const reader = new FileReader();
            reader.onload = () => {
                setDisplayedImage(reader.result as string);
            };
            reader.readAsDataURL(selectedImage);
        }
    }, [selectedImage]);

    const handleBack = () => {
        router.back();
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
    
    console.log(userData)
    return (
        <>
            {allowed && <NavbarMentor />}
            <NavbarMentor/>
            <div className="d-flex flex-column min-vh-100 align-items-center">
                <div className="container mt-3 mb-3">
                    <Head>Profil</Head>
                    <div className="d-flex justify-content-between align-items-start">
                        <div className="div className=d-flex flex-column gap-3 align-items-start" style={{ width: '20%', marginTop: '30px'}}>
                            <LabelValuePair label="Email" value={email} />
                            <LabelValuePair label="Tanggal Lahir" value={userData.tanggalLahirMentor} />
                            <LabelValuePair label="No. Handphone" value={userData.noHPMentor} />
                            <LabelValuePair label="Gender" value={userData.genderMentor} />
                            <LabelValuePair label="Pendidikan Terakhir" value={userData.pendidikanMentor} />
                            <LabelValuePair label="Kategori" value={mentorCategory} />
                        </div>
                        <div className="position-relative">
                        {userData.image ? (
                            <div className="rounded-circle border" style={{ width: '250px', height: '250px', overflow: 'hidden' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={userData.image}
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
                            <p>No image uploaded yet</p>
                        )}
                        <h5 style={{ textAlign: 'center', padding: '10px' }}><b>{userName}</b></h5>
                        <p style={{ textAlign: 'center' }}>{userData.instansiMentor}</p>
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
