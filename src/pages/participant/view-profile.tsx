import NavbarParticipant from '@/components/Navbar/NavbarParticipant';
import { checkAuth } from '@/utils/auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface Participant {
  instance_id: number;
  name: string;
  position: string;
  email: string;
  latest_education: string;
  education_background: string;
  focus: string;
  area: string;
  whatsapp_number: string;
}

const ParticipantProfileView = () => {
  const router = useRouter();
  const [participantData, setParticipantData] = useState<Participant | undefined>();

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

  useEffect(() => {
    if (!participantData || Object.keys(participantData).length === 0) {
      router.push('/participant-login');
    }
  }, [participantData, router]);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getParticipant = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/me`, {
        credentials: 'include',
      });
      const res = await response.json();
      const userEmail = res.data.email;

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
        setParticipantData(participant);
        console.log(participant);

        if (!participant) {
          console.error('Participant not found');
          return null;
        }
        return participant;
      } catch (error) {
        console.error('Error fetching participant data:', error);
        return null;
      }
    } catch (error) {
      console.error('Error fetching participant data:', error);
      return null;
    }
  };

  useEffect(() => {
    getParticipant();
  });

  type LabelValuePairProps = {
    label: string;
    value: string;
  };

  const LabelValuePair = ({ label, value }: LabelValuePairProps) => (
    <p style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginBottom: '10px' }}>
      <span style={{ flex: '0 0 120%', fontWeight: 'bold' }}>{label}</span>
      <span style={{ flex: '0 0 100%' }}>{value}</span>
    </p>
  );

  return (
    <>
      <Head>
        <title>LEAD - Profil Peserta</title>
      </Head>
      {allowed && <NavbarParticipant />}
      <div className="d-flex flex-column min-vh-100 align-items-center">
        <div className="container mt-3 mb-3">
          <h1>Profil</h1>
          <hr />
          <div className="div className=d-flex flex-column gap-3 align-items-start" style={{ width: '20%', marginTop: '30px' }}>
            <h4>{participantData?.name}</h4>
            <LabelValuePair label="Email" value={participantData?.email || ''} />
            <LabelValuePair label="Posisi" value={participantData?.position || ''} />
            <LabelValuePair label="Pendidikan terakhir" value={participantData?.latest_education || ''} />
            <LabelValuePair label="Latar Bekakang Pendidikan" value={participantData?.education_background || ''} />
            <LabelValuePair label="Fokus Isu" value={participantData?.focus || ''} />
            <LabelValuePair label="No. Whatsapp" value={participantData?.whatsapp_number || ''} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ParticipantProfileView;
