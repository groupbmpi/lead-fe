import { useRegistration } from '@/contexts/RegistrationContext';
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import React from 'react';

const SummaryRegistration = () => {
  const { userData, setUserData } = useRegistration();
  const router = useRouter();
  const [confirmedData, setConfirmedData] = useState(false);
  const [confirmedConcept, setConfirmedConcept] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  type LabelValuePairProps = {
    label: string;
    value: string;
  };

  useEffect(() => {
    if (!userData || Object.keys(userData).length === 0) {
        router.push('/registration/instance');
    }
  }, [userData, router]);

  useEffect(() => {
    setButtonDisabled(!(confirmedData && confirmedConcept));
  }, [confirmedData, confirmedConcept]);

  const handleConfirmationDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmedData(e.target.checked);
  };

  const handleConfirmationConceptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmedConcept(e.target.checked);
  };

  const handleButtonClick = () => {
    if (confirmedData && confirmedConcept) {
      window.location.href = '/'; 
    }
  };

  const LabelValuePairInstance = ({ label, value }: LabelValuePairProps) => (
    <p style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ flex: '0 0 24.5%' }}>{label}</span>
      <span style={{ flex: '0 0 24.5%' }}>: {value}</span>
    </p>
  ); 

  const LabelValuePair = ({ label, value }: LabelValuePairProps) => (
    <p style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ flex: '0 0 50%' }}>{label}</span>
      <span style={{ flex: '0 0 50%' }}>: {value}</span>
    </p>
  );

  const renderParticipant1Data = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <LabelValuePair label="Nama Peserta" value={userData.namaPeserta1} />
        <LabelValuePair label="Email Peserta" value={userData.emailPeserta1} />
        <LabelValuePair label="Pendidikan Terakhir Peserta" value={userData.pendidikanPeserta1} />
        <LabelValuePair label="No Whatsapp Peserta" value={userData.whatsappPeserta1} />
        <Link className="btn btn-primary" href="/registration/participant-1">Ubah</Link>
      </div>
    );
  };

  const renderParticipant2Data = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <LabelValuePair label="Nama Peserta" value={userData.namaPeserta2} />
        <LabelValuePair label="Email Peserta" value={userData.emailPeserta2} />
        <LabelValuePair label="Pendidikan Terakhir Peserta" value={userData.pendidikanPeserta2} />
        <LabelValuePair label="No Whatsapp Peserta" value={userData.whatsappPeserta2} />
        <Link className="btn btn-primary" href="/registration/participant-2">Ubah</Link>
      </div>
    );
  };

  const fullAddress = `${userData.alamatKantor}, ${userData.kotaKantor}, ${userData.provinsiKantor}`;

  return (
    <>
      <Head>
        <title>Ringkasan Registrasi</title>
      </Head>
      <div className="container d-flex flex-column gap-2 align-items-left justify-content-left vh-90">
        <h2>Ringkasan</h2>
        <h3>Instansi</h3>
        <h5>Profil</h5>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <LabelValuePairInstance label="Nama Instansi" value={userData.namaInstansi} />
          <LabelValuePairInstance label="Email Instansi" value={userData.emailInstansi} />
          <LabelValuePairInstance label="Tahun/Bulan Berdiri Instansi" value={userData.tanggalBerdiri} />
          <LabelValuePairInstance label="Jenis Instansi" value={userData.jenisInstansi} />
          <LabelValuePairInstance label="Jenis Cluster" value={userData.jenisCluster} />
          <LabelValuePairInstance label="Alamat Lengkap" value={fullAddress} />
          <LabelValuePairInstance label="Instagram Instansi" value={userData.instagramInstansi} />
          <LabelValuePairInstance label="Website Instansi" value={userData.websiteInstansi} />
          <LabelValuePairInstance label="Tiktok Instansi" value={userData.tiktokInstansi} />
          <LabelValuePairInstance label="Youtube Instansi" value={userData.youtubeInstansi} />
          <LabelValuePairInstance label="Jumlah Penerima Manfaat" value={userData.jumlahPenerimaManfaat} />
          <Link className="btn btn-primary" href="/registration/instance">Ubah</Link>
        </div>
        <h3>Peserta</h3>
        <div className="row">
          <div className="col">
            <h5>Peserta I</h5>
            {userData.namaPeserta1 ? renderParticipant1Data() : (
              <div className="d-flex flex-column">
                <Link className="btn btn-primary" href="/registration/participant-1">Tambah</Link>
              </div>
            )}
          </div>
          <div className="col">
            <h5>Peserta II</h5>
            {userData.namaPeserta2 ? renderParticipant2Data() : (
              <div className="d-flex flex-column">
                <Link className="btn btn-primary" href="/registration/participant-2">Tambah</Link>
              </div>
            )}
          </div>
        </div>
        <div>
          <input
            type="checkbox"
            id="confirmData"
            name="confirmData"
            checked={confirmedData}
            onChange={handleConfirmationDataChange}
          />
          <label htmlFor="confirmData">Saya konfirmasi bahwa semua informasi yang saya berikan di atas adalah akurat dan terkini</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="confirmConcept"
            name="confirmConcept"
            checked={confirmedConcept}
            onChange={handleConfirmationConceptChange}
          />
          <label htmlFor="confirmConcept">Saya sudah membaca dan memahami
            <Link href="https://bit.ly/LEADBCF-2023">Concept Note</Link>
          </label>
        </div>
        <button className="btn btn-primary" onClick={handleButtonClick} disabled={buttonDisabled}>
          Daftar
        </button>
      </div>
    </>
  );
}

export default SummaryRegistration;