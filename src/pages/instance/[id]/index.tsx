import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavbarParticipant from '@/components/Navbar/NavbarParticipant';
import Head from 'next/head';
import cookies from 'js-cookie';
import { checkAuth, getEmail, getUserName, } from "@/utils/auth";

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
    const [allowed, setAllowed] = useState(false);
    const [error, setError] = useState(null);
    const userName = getUserName();
    console.log(userName);
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // useEffect(() => {
    //     const checkAuthentication = async () => {
    //       const isAllowed = await checkAuth(['PARTICIPANT']);
    //       setAllowed(isAllowed);
    
    //       if (!isAllowed) {
    //         router.push('/participant-login');
    //       }
    //     };
    //     checkAuthentication();
    // });
    
    const getParticipant = async (userName: string) => {
        try {
            const response = await fetch(`${backendUrl}/api/v1/participant?name=${userName}`);
            const participantData = await response.json();
            const participant = participantData?.data;

            if (!participant) {
                console.error('Participant not found');
                return null;
            }

            console.log(participant.instance_id);
            return participant.instance_id;
        } catch (error) {
            console.error('Error fetching participant data:', error);
            return null;
        }
    };
      

    const fetchInstance = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/v1/instance/${id}`);
            const res = await response.json();
            console.log(res.data);
            setInstance(res.data);
        } catch (error) {
            console.error('Error fetching instance data:', error);
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

    if (instance) {
        // // Check if logged-in participant's instance_id matches the instance being viewed
        // const loggedInParticipantInstanceID = await getParticipant(userName);

        // // Disable edit functionality if the logged-in participant doesn't match the instance being viewed
        // const canEdit = loggedInParticipantInstanceID === instance.instance_id;

        return (
            <>
                {/* <NavbarParticipant /> */}
                <div className="d-flex flex-column min-vh-100">
                    <div className="container mt-3 mb-3">
                        <Head>View Instance</Head>
                        <h1>Instance Details</h1>
                        <hr />
                        {instance && (
                            <div>
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
                            {/* {canEdit ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => router.push(`/instance/${id}/edit`)}
                                >
                                    Edit
                                </button>
                            ) : (
                                <p>Anda tidak memiliki izin untuk mengedit instance ini.</p>
                            )} */}
                            </div>
                        )}
                    </div>
                    <button className="btn btn-primary" onClick={() => router.push(`/instance/${id}/edit`)}>Edit</button>
                </div>
            </>
        );
    }
    return null;
};

export default Instance;