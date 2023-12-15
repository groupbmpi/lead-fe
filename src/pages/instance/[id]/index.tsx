import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavbarParticipant from '@/components/Navbar/NavbarParticipant';
import Head from 'next/head';
import { checkAuth, getRole } from "@/utils/auth";
import NavbarMentor from '@/components/Navbar/NavbarMentor';
import NavbarAdmin from '@/components/Navbar/NavbarAdmin';

interface Instance {
  status: string;
  batch: string;
  instance_id: number;
  name: string;
  description: string;
  email: string;
  established_month: string;
  established_year: string;
  type: string;
  sector: string;
  focus: string;
  area: string;
  total_beneficiaries: string;
  social_instagram: string;
  social_website: string;
  social_tiktok: string;
  social_youtube: string;
  address_street: string;
  address_village: string;
  address_district: string;
  address_regency: string;
  address_province: string;
  address_postal_code: string;
  stable_fund_source: string;
}

const Instance = () => {
  const router = useRouter();
  const { id } = router.query;
  const [instance, setInstance] = useState<Instance | null>(null);
  const [allowed, setAllowed] = useState(false);
  const [role, setRole] = useState<string>();
  const [userInstanceId, setUserInstanceId] = useState<number>();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAllowed = await checkAuth(['MENTOR', 'ADMIN', 'PARTICIPANT', 'SUPERADMIN']);
      setAllowed(isAllowed);

      if (!isAllowed) {
        router.push('/');
      }
      setRole(getRole);
    };
    checkAuthentication();
  });

  const getParticipant = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/me`, {
        credentials: 'include',
      });
      const res = await response.json();
      console.log(res);
      const userEmail = res.data.email;
      console.log(userEmail);

      if (!userEmail) {
        console.error('Participant not found');
        return null;
      }
      try {
        const response = await fetch(`${backendUrl}/api/v1/participant?email=${userEmail}`, {
          credentials: 'include',
        });
        const participantData = await response.json();
        console.log(participantData);
        const participant = participantData?.data;
        console.log(participant);

        if (!participant) {
          console.error('Participant not found');
          return null;
        }

        console.log(participant.instance_id);
        setUserInstanceId(participant.instance_id);
        return participant.instance_id;
      } catch (error) {
        console.error('Error fetching participant data:', error);
        return null;
      }
    } catch (error) {
      console.error('Error fetching participant data:', error);
      return null;
    }
  };


  const fetchInstance = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/instance/${id}`,{
        credentials: 'include',
      });
      if (response.ok){
        const res = await response.json();
        setInstance(res.data);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching instance data:', error);
    }
  }

  useEffect(() => {
    if (!id) return;
    fetchInstance();
    if (role == 'PARTICIPANT'){
      getParticipant();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const fullAddress = `${instance?.address_street}, ${instance?.address_village}, ${instance?.address_district}, ${instance?.address_regency}, ${instance?.address_province}, ${instance?.address_postal_code}`;
  const establishedDate = `${instance?.established_month}, ${instance?.established_year}`;

  if (instance) {
    const canEdit = userInstanceId === instance.instance_id;

    return (
      <>
        <Head>
          <title>LEAD - View Instance</title>
        </Head>
        {allowed && role == "PARTICIPANT" && <NavbarParticipant />}
        {allowed && role == "MENTOR" && <NavbarMentor />}
        {allowed && role == "ADMIN" && <NavbarAdmin />}
        {allowed && role == "SUPERADMIN" && <NavbarAdmin />}
        <div className="d-flex flex-column min-vh-100">
          <div className="container mt-3 mb-3">
            <h1>Instance Details</h1>
            <hr />
            {instance && (
              <div>
                <h3>{instance.name}</h3>
                <p>{instance.description}</p>
                <LabelValuePair label="Email" value={instance.email} />
                <LabelValuePair label="Batch" value={instance.batch} />
                <LabelValuePair label="Alamat" value={fullAddress} />
                <LabelValuePair label="Didirikan Pada" value={establishedDate} />
                <LabelValuePair label="Jenis Instansi" value={instance.type} />
                <LabelValuePair label="Jenis Cluster" value={instance.sector} />
                <LabelValuePair label="Fokus Isu" value={instance.focus} />
                <LabelValuePair label="Area Tercakup" value={instance.area} />
                <LabelValuePair label="Total Penerima Manfaat" value={instance.total_beneficiaries} />
                <LabelValuePair label="Instagram" value={instance.social_instagram} />
                <LabelValuePair label="Website" value={instance.social_website} />
                <LabelValuePair label="Tiktok" value={instance.social_tiktok} />
                <LabelValuePair label="Youtube" value={instance.social_youtube} />
                <LabelValuePair label="Status" value={instance.status} />
                {canEdit && role == "PARTICIPANT" && userInstanceId && (
                  <div className="d-flex align-items-center justify-content-center my-4">
                    <button
                      className="btn btn-primary w-25"
                      onClick={() => router.push(`/instance/${id}/edit`)}
                    >
                      Ubah
                    </button>
                  </div>
                )}
                {role == "PARTICIPANT" && !canEdit &&
                (
                  <p className='text-center text-danger my-4'>Anda tidak memiliki izin untuk mengedit instance ini.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
  return null;
};

export default Instance;