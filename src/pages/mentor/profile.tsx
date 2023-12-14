import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useRegistration } from '@/contexts/RegistrationContext';
import NavbarMentor from '@/components/Navbar/NavbarMentor';
import Head from 'next/head';
import { getUserName, getEmail, getMentorCategory, getId, checkAuth } from '@/utils/auth';

interface UserData {
    name: string;
    email: string;
    category: string;
    birthdate: string;
    gender: string;
    phone_number: string;
    current_workplace: string;
    url_picture: string; 
}

const MentorProfile: React.FC = () => {
    const router = useRouter();
    const id = getId();
    const { userData, setUserData } = useRegistration();
    const [formData, setFormData] = useState({ ...userData });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<string>('');
    const email = getEmail();
    const userName = getUserName();
    const mentorCategory = getMentorCategory();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

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
        const fetchMentorData = async () => {
          try {
            const response = await fetch(`${backendUrl}/api/v1/mentor?mentor_id=${id}`, {
              credentials: 'include',
            });
                if (response.ok) {
                    const res = await response.json();
                    const mentorData = (res.data);
                    // Assuming the mentor data structure matches the userData structure
                    setUserData(prevUserData => ({
                        ...prevUserData,
                        ...mentorData, // Update the state with mentor data
                    }));
                }
            } catch (error) {
                console.error('Error fetching mentor data:', error);
            }
        };
    
        fetchMentorData();
    }, [id]);
    
    // const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     const file: File | null = e.target.files ? e.target.files[0] : null;
    //     setSelectedImage(file);

    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (event) => {
    //             setFormData((prevData) => ({
    //                 ...prevData,
    //                 image: event.target?.result as string,
    //             }));
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file: File | null = e.target.files ? e.target.files[0] : null;
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

    const handleUpload = () => {
        console.log(selectedImage);
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
            category: userData.kategoriMentor,
            birthdate: userData.tanggalLahirMentor,
            gender: userData.genderMentor,
            phone_number: userData.noHPMentor,
            education_background: userData.pendidikanMentor,
            current_workplace: userData.instansiMentor,
            url_picture: imageURL,
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
            <div className="d-flex flex-column min-vh-100">
                {allowed && <NavbarMentor />}
                <NavbarMentor />
                <div className="container-fluid w-sm-50 w-100 align-items-center text-center justify-content-center d-flex flex-column flex-grow-1">
                    <form onSubmit={handleSubmit}>
                        <Head>
                            <title>Profile</title>
                        </Head>
                        <h1>Profil Mentor</h1>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <div className="col-sm-10">
                                <input type="text" onChange={(e) => setUserData({ ...userData, email: e.target.value })} className="form-control-plaintext" name="email" value={userData.email}/> 
                            </div>
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="namaMentor" className="form-label">Nama Lengkap</label>
                            <input value={userName} onChange={(e) => setUserData({ ...userData, namaMentor: e.target.value })} type="text" className="form-control" name="namaMentor" required/>
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="tanggalLahirMentor" className="form-label">Tanggal Lahir</label>
                            <input value={userData.tanggalLahirMentor} onChange={(e) => setUserData({ ...userData, tanggalLahirMentor: e.target.value })} type="date" className="form-control" name="tanggalLahirMentor" required/>
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="noHPMentor" className="form-label">No Handphone</label>
                            <input value={userData.noHPMentor} onChange={(e) => setUserData({ ...userData, noHPMentor: e.target.value })} type="tel" className="form-control" name="noHPMentor" placeholder="cth : 6281234567890" required/>
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="genderMentor" className="form-label">Gender</label>
                            <select value={userData.genderMentor} onChange={(e) => setUserData({ ...userData, genderMentor: e.target.value })} className="form-select" name="genderMentor" required>
                                <option disabled selected>Pilih</option>
                                <option value="Pria">Pria</option>
                                <option value="Wanita">Wanita</option>
                            </select>
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="pendidikanMentor" className="form-label">Pendidikan Terakhir</label>
                            <select value={userData.pendidikanMentor} onChange={(e) => setUserData({ ...userData, pendidikanMentor: e.target.value })} className="form-select" name="pendidikanMentor" required>
                                <option disabled selected>Pilih</option>
                                <option value="SD/Sederajat">SD/Sederajat</option>
                                <option value="SMP/Sederajat">SMP/Sederajat</option>
                                <option value="SMA/SMK/Sederajat">SMA/SMK/Sederajat</option>
                                <option value="D3">D3</option>
                                <option value="Tidak selesai S1">Tidak selesai S1</option>
                                <option value="D4/S1">D4/S1</option>
                                <option value="S2">S2</option>
                                <option value="S3">S3</option>
                            </select>
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="instansiMentor" className="form-label">Instansi</label>
                            <input value={userData.instansiMentor} onChange={(e) => setUserData({ ...userData, instansiMentor: e.target.value })} type="text" className="form-control" name="instansiMentor" required/>
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <label htmlFor="kategoriMentor" className="form-label">Kategori</label>
                            <select value={mentorCategory} onChange={(e) => setUserData({ ...userData, kategoriMentor: e.target.value })} className="form-select" name="kategoriMentor" required>
                                <option disabled selected>Pilih</option>
                                <option value="mentorCluster">Cluster</option>
                                <option value="mentorDesainProgram">Desain Program</option>
                            </select>
                        </div>
                        {imageURL && (
                            <div className="d-flex flex-column align-items-start mb-3">
                                <label htmlFor="fotoMentor" className="form-label">
                                    Preview Image
                                </label>
                                <img src={imageURL} alt="Uploaded" />
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary" onClick={handleUpload}>
                            Simpan
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default MentorProfile;
