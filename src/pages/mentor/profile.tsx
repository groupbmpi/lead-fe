import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useRegistration } from '@/contexts/RegistrationContext';
import NavbarMentor from '@/components/Navbar/NavbarMentor';
import Head from 'next/head';
import { getId, checkAuth } from '@/utils/auth';

const MentorProfile: React.FC = () => {
    const router = useRouter();
    const id = getId();
    const { userData, setUserData } = useRegistration();
    const [formData, setFormData] = useState({ ...userData });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<string>('');

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
        const fetchMentorData = async () => {
          try {
            const response = await fetch(`${backendUrl}/api/v1/mentor/${id}`, {
              credentials: 'include',
            });
                if (response.ok) {
                    const res = await response.json();
                    const mentorData = (res.data);
                    setUserData(prevUserData => ({
                        ...prevUserData,
                        ...mentorData,
                    }));
                }
            } catch (error) {
                console.error('Error fetching mentor data:', error);
            }
        };
    
        fetchMentorData();
    }, [id]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        let file: File | null = e.target.files ? e.target.files[0] : null;

        if (file) {
            const maxSizeInBytes = 1 * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                alert('File size exceeds 1 MB limit. Please select a smaller file.');
                file = null;
                return;
            }
        }
        setSelectedImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData((prevData) => ({
                    ...prevData,
                    image: event.target?.result as string,
                }));
                setImageURL(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const mentorProfileForm = new FormData(e.currentTarget);
        const mentorProfileData: Record<string, string> = {};
        mentorProfileForm.forEach((value, key) => {
            mentorProfileData[key] = value.toString();
        });
        setUserData((prevUserData) => ({
            ...prevUserData,
            ...mentorProfileData,
            image: formData.image,
        })); 

        const userDataPayload = {
            email: userData.email,
            name: userData.name,
            category: userData.category,
            birthdate: userData.birthdate,
            gender: userData.gender,
            phone_number: userData.phone_number,
            education_background: userData.education_background,
            position: userData.position,
            current_workplace: userData.current_workplace,
            role: "MENTOR",
        }

        const response = await fetch(`${backendUrl}/api/v1/mentor/${id}`, {
            credentials: 'include',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userDataPayload),
        });

        if (response.ok) {
            router.push(`/mentor/profile-view`);
        }
    };

    console.log(userData)
    return (
        <>
            <Head>
                <title>LEAD - Edit Profile Mentor</title>
            </Head>
            {allowed && <NavbarMentor />}
            <div className="d-flex flex-column min-vh-100">
                <div className="container-fluid w-sm-80 w-md-50 w-lg-40 w-xl-30 mx-auto align-items-center text-center justify-content-center d-flex flex-column flex-grow-1">
                    <form onSubmit={handleSubmit} style={{width:"20%"}}>
                        <h1>Profil Mentor</h1>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} type="text" className="form-control" name="email" disabled/> 
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="namaMentor" className="form-label">Nama Lengkap</label>
                            <input value={userData.name} onChange={(e) => setUserData({ ...userData, namaMentor: e.target.value })} type="text" className="form-control" name="namaMentor" disabled/>
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="birthdate" className="form-label">Tanggal Lahir</label>
                            <input value={userData.birthdate} onChange={(e) => setUserData({ ...userData, birthdate: e.target.value })} type="date" className="form-control" name="birthdate" required/>
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="phone_number" className="form-label">No Handphone</label>
                            <input value={userData.phone_number} onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })} type="tel" className="form-control" name="phone_number" placeholder="cth : 6281234567890" required/>
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="gender" className="form-label">Gender</label>
                            <select value={userData.gender} onChange={(e) => setUserData({ ...userData, gender: e.target.value })} className="form-select" name="gender" disabled>
                                <option value="Pria">Pria</option>
                                <option value="Wanita">Wanita</option>
                            </select>
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="education_background" className="form-label">Pendidikan Terakhir</label>
                            <select value={userData.education_background} onChange={(e) => setUserData({ ...userData, education_background: e.target.value })} className="form-select" name="education_background" required>
                                <option value="S1">S1</option>
                                <option value="S2">S2</option>
                                <option value="S3">S3</option>
                            </select>
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="current_workplace" className="form-label">Instansi</label>
                            <input value={userData.current_workplace} onChange={(e) => setUserData({ ...userData, current_workplace: e.target.value })} type="text" className="form-control" name="current_workplace" required/>
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="position" className="form-label">Posisi</label>
                            <input value={userData.position} onChange={(e) => setUserData({ ...userData, position: e.target.value })} type="text" className="form-control" name="position" disabled/>
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="category" className="form-label">Kategori</label>
                            <select value={userData.category} onChange={(e) => setUserData({ ...userData, category: e.target.value })} className="form-select" name="category" required>
                                <option value="Cluster">Cluster</option>
                                <option value="Desain Program">Desain Program</option>
                            </select>
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="url_picture" className="form-label">Upload Picture</label>
                            <input onChange={handleImageChange} type="file" className="form-control" name="url_picture" accept=".jpg, .jpeg, .png" />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Simpan
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default MentorProfile;
