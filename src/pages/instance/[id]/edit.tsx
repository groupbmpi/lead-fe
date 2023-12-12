import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavbarParticipant from '@/components/Navbar/NavbarParticipant';
import Head from 'next/head';
import { checkAuth } from '@/utils/auth';

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

const InstanceEdit = () => {
    const router = useRouter();
    const { id } = router.query;
    const [instanceData, setInstanceData] = useState({});
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
            const response = await fetch(`${backendUrl}/api/v1/instance/${id}`, {
                credentials: 'include',
            });
            const res = await response.json();
            setInstanceData(res.data);
            setFormData(res.data);
        } catch (error) {
            console.error('Error fetching instance data:', error);
        }
    }

    useEffect(() => {
        fetchInstance();
    }, [id]);

    const fetchData = async () => {
        try {
            const response1 = await fetch(`${backendUrl}/api/v1/instance/${id}`, {
                credentials: 'include',
            });
            const instanceData = await response1.json();
            console.log(instanceData.data);
            setInstanceData(instanceData.data);

            const response2 = await fetch(`${backendUrl}/api/v1/me`, {
                credentials: 'include',
            });
            const res = await response2.json();
            const userEmail = res.data.email;

            const response3 = await fetch(`${backendUrl}/api/v1/participant?email=${userEmail}`, {
                credentials: 'include',
            });
            const participantData = await response3.json();
            const participant = participantData?.data;

            if (!participant) {
                console.error('Participant not found');
                return null;
            }

            if (participant.instance_id != id) {
                router.push(`/instance/${id}`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (!id) return;
        fetchData();
    }, [id]);

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        console.log(formData);
        try {
            const response = await fetch(`${backendUrl}/api/v1/instance/${id}`, {
                credentials: 'include',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push(`/instance/${id}`);
            }

        } catch (error) {
            console.error('Error updating instance:', error);
        }
    };

    const [allowed, setAllowed] = useState(false);
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

    return (
        <>
            <Head>
                <title>LEAD - Edit Instance</title>
            </Head>
            {allowed && <NavbarParticipant />}
            {formData && 
            <div className="d-flex flex-column min-vh-100">
                <div className="container-fluid w-sm-50 w-100 align-items-center text-center justify-content-center d-flex flex-column flex-grow-1" style={{marginTop: '20px', marginBottom: '20px' }}>
                    <h1>Edit Instance</h1>
                    <form onSubmit={handleSubmit} >
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="name" className="form-label">Nama</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="name" value={formData.name || ''} disabled />
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="email" className="form-label">Email</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="email" value={formData.email || ''} disabled />
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="established_month" className="form-label">Bulan Berdiri</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="established_month" value={formData.established_month || ''} disabled />
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="established_year" className="form-label">Tahun Berdiri</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="established_year" value={formData.established_year || ''} disabled />
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="type" className="form-label">Jenis Instansi</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="type" value={formData.type || ''} disabled />
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="sector" className="form-label">Jenis Cluster</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="sector" value={formData.sector || ''} disabled />
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="focus" className="form-label">Fokus Isu</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="focus" value={formData.focus || ''} disabled />
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="total_beneficiaries" className="form-label">Total Penerima Manfaat</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="total_beneficiaries" value={formData.total_beneficiaries || ''} onChange={handleChange} />
                            </div>
                        </div>

                        <h5><b>Alamat</b></h5>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="address_street" className="form-label">Nama Jalan</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="address_street" value={formData.address_street || ''} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="address_district" className="form-label">Nama District</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="address_district" value={formData.address_district || ''} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="address_regency" className="form-label">Nama Kota</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="address_regency" value={formData.address_regency || ''} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="address_province" className="form-label">Nama Provinsi</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="address_province" value={formData.address_province || ''} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="address_postal_code" className="form-label">Kode Pos</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="address_postal_code" value={formData.address_postal_code || ''} onChange={handleChange} />
                            </div>
                        </div>

                        <h5><b>Social Media</b></h5>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="social_instagram" className="form-label">Instagram</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="social_instagram" value={formData.social_instagram || ''} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="social_website" className="form-label">Website</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="social_website" value={formData.social_website || ''} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="social_tiktok" className="form-label">Tiktok</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="social_tiktok" value={formData.social_tiktok || ''} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-3">
                                <label htmlFor="social_youtube" className="form-label">Youtube</label>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="social_youtube" value={formData.social_youtube || ''} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-10 text-center">
                            <button className="btn btn-primary" type="submit">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>}
        </>
    )
}

export default InstanceEdit;