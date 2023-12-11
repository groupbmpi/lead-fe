import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavbarParticipant from '@/components/Navbar/NavbarParticipant';
import Head from 'next/head';

interface Instance {
    instance_id: number;
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

const Instance = () => {
    const router = useRouter();
    const { id } = router.query;
    const [instance, setInstance] = useState<Instance | null>(null);
    const [error, setError] = useState(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
//   useEffect(() => {
//     const fetchInstance = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/api/v1/instance/${id}`);
//         const res = await response.json();
//         const instanceData = (res.data);
//         console.log(res.data)
//         if (instanceData.error) {
//           setError(instanceData.error);
//         } else {
//           setInstance(instanceData.instance);
//         }
//       } catch (error) {
//         console.error('Error fetching province data:', error);
//       }
//     };

//     fetchInstance();
//   }, [id]);

    const fetchInstance = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/v1/instance/${id}`);
            const res = await response.json();
            console.log(res.data);
            setInstance(res.data);
        } catch (error) {
            console.error('Error fetching province data:', error);
        }
    }

    useEffect(() => {
        fetchInstance();
    }, [id]);

    type LabelValuePairProps = {
        label: string;
        value: string;
    };

    const LabelValuePair = ({ label, value }: LabelValuePairProps) => (
        <p style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginBottom: '10px' }}>
            <span style={{ flex: '0 0 40%', fontWeight: 'bold' }}>{label}</span>
            <span style={{ flex: '0 0 100%' }}>{value}</span>
        </p>
    );

    if (error) {
        return <p>Error: {error}</p>;
    }

    const fullAddress = `${instance?.address_street}, ${instance?.address_district}, ${instance?.address_regency}, ${instance?.address_province}, ${instance?.address_postal_code}`;
    const establishedDate = `${instance?.established_month}, ${instance?.established_year}`;
    return (
        <>
            <NavbarParticipant />
            <div className="d-flex flex-column min-vh-100">
                <div className="container mt-3 mb-3">
                    <Head>View Instance</Head>
                    <h1>Instance Details</h1>
                    <hr />
                    {instance && (
                        <div>
                        {/* <p>Instance ID: {instance.instance_id}</p> */}
                        <h3>{instance.name}</h3>
                        <LabelValuePair label="Email" value={instance.email} />
                        <LabelValuePair label="Alamat" value={fullAddress} />
                        <LabelValuePair label="Tanggal Berdiri" value={establishedDate} />
                        <LabelValuePair label="Jenis Instansi" value={instance.type} />
                        <LabelValuePair label="Jenis Cluster" value={instance.sector} />
                        <LabelValuePair label="Fokus Isu" value={instance.focus} />
                        <LabelValuePair label="Total Penerima Manfaat" value={instance.total_beneficiaries} />
                        <LabelValuePair label="Instagram" value={instance.social_instagram} />
                        <LabelValuePair label="Website" value={instance.social_website} />
                        <LabelValuePair label="Tiktok" value={instance.social_tiktok} />
                        <LabelValuePair label="Youtube" value={instance.social_youtube} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Instance;