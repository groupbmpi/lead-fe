import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavbarParticipant from '@/components/Navbar/NavbarParticipant';
import Head from 'next/head';

interface InstanceData {
    name: string;
    email: string;
    established_month: string;
    established_year: string;
    type: string;
    sector: string;
    focus: string;
    total_beneficiaries: string;
    social_instagram: string;
    social_website: string;
    social_tiktok: string;
    social_youtube: string;
    address_street: string;
    address_district: string;
    address_regency: string;
    address_province: string;
    address_postal_code: string;
}

// interface ParticipantData {
//     name: string;
//     instance_id: string;
// }

const InstanceEdit = () => {
    const router = useRouter();
    const { id } = router.query;

    const [instanceData, setInstanceData] = useState({});
    // const [participantData, setParticipantData] = useState<ParticipantData | null>(null);
    // const [isAuthorizedToEdit, setIsAuthorizedToEdit] = useState(false);

    const [formData, setFormData] = useState<InstanceData>({
        name: '', 
        email: '',
        established_month: '',
        established_year: '',
        type: '',
        sector: '',
        focus: '',
        total_beneficiaries: '',
        social_instagram: '',
        social_website: '',
        social_tiktok: '',
        social_youtube: '',
        address_street: '',
        address_district: '',
        address_regency: '',
        address_province: '',
        address_postal_code: '',
    });
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchInstance = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/v1/instance/${id}`);
            const res = await response.json();
            setInstanceData(res.data);
            setFormData(res.data); // Set default form values
        } catch (error) {
            console.error('Error fetching instance data:', error);
        }
    }

    useEffect(() => {
        fetchInstance();
    }, [id]);

    // const fetchData = async () => {
    //     try {
    //       const response1 = await fetch(`${backendUrl}/api/v1/instance/${id}`);
    //       const instanceData = await response1.json();
    //       setInstanceData(instanceData.data);
    
    //       const response2 = await fetch(`${backendUrl}/api/v1/participant/me`);
    //       const participantData = await response2.json();
    //       setParticipantData(participantData);
    
    //       // Check authorization based on instance and participant data
    //       setIsAuthorizedToEdit(participantData && instanceData && participantData.instance_id === instanceData.instance_id);
    //     } catch (error) {
    //       console.error('Error fetching data:', error);
    //     }
    //   };
    
    //   useEffect(() => {
    //     fetchData();
    //   }, [id]);
    
    //   if (!isAuthorizedToEdit) {
    //     router.push(`/instance/${id}`);
    //     return <></>;
    // }

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        console.log(formData);
        try {
            const response = await fetch(`${backendUrl}/api/v1/instance/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchInstance();
                router.push(`/instance/${id}`);
            }
        } catch (error) {
            console.error('Error updating instance:', error);
        }
    };

    return (
        <>
            <NavbarParticipant />
            <div className="d-flex flex-column min-vh-100">
                <div className="container d-flex flex-column gap-3 align-items-center justify-content-center vh-90">
                    <Head>Edit Instance</Head>
                    <h1>Edit Instance</h1>
                    <form onSubmit={handleSubmit} >
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="name" className="form-label">Nama</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="name" value={formData.name || ''} onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="email" className="form-label">Email</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="email" value={formData.email || ''} onChange={handleChange}/>
                            </div>
                        </div>

                        <h5><b>Alamat</b></h5>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="address_street" className="form-label">Nama Jalan</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="address_street" value={formData.address_street || ''} onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="address_district" className="form-label">Nama District</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="address_district" value={formData.address_district || ''} onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="address_regency" className="form-label">Nama Kota</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="address_regency" value={formData.address_regency || ''} onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="address_province" className="form-label">Nama Provinsi</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="address_province" value={formData.address_province || ''} onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="address_postal_code" className="form-label">Kode Pos</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="address_postal_code" value={formData.address_postal_code || ''} onChange={handleChange}/>
                            </div>
                        </div>
                    
                        <h5><b>Social Media</b></h5>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="social_instagram" className="form-label">Instagram</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="social_instagram" value={formData.social_instagram || ''} onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="social_website" className="form-label">Website</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="social_website" value={formData.social_website || ''} onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="social_tiktok" className="form-label">Tiktok</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="social_tiktok" value={formData.social_tiktok || ''} onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="social_youtube" className="form-label">Youtube</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="social_youtube" value={formData.social_youtube || ''} onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="col-12 text-center">
                            <button className="btn btn-primary" type="submit" onClick={() => router.push(`/instance/${id}`)}>Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default InstanceEdit;