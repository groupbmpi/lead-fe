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

  useEffect(() => {
    if (!userData || Object.keys(userData).length === 0) {
        router.push('/registration/instance');
    }
  }, [userData, router]);

  const handleConfirmationDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmedData(e.target.checked);
    //     setError('')
  };

  const handleConfirmationConceptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmedConcept(e.target.checked);
    //     setError('')
  };

  const renderParticipant1Data = () => {
    return (
      <div>
        <p>Nama Peserta               : {userData.namaPeserta1}</p>
        <p>Email Peserta              : {userData.emailPeserta1}</p>
        <p>Pendidikan Terakhir Peserta: {userData.pendidikanPeserta1}</p>
        <p>No Whatsapp Peserta        : {userData.whatsappPeserta2}</p>
        <Link className="btn btn-primary" href="/registration/participant-1">Ubah</Link>
      </div>
    );
  };

  const renderParticipant2Data = () => {
    return (
      <div>
        <p>Nama Peserta               : {userData.namaPeserta2}</p>
        <p>Email Peserta              : {userData.emailPeserta2}</p>
        <p>Pendidikan Terakhir Peserta: {userData.pendidikanPeserta2}</p>
        <p>No Whatsapp Peserta        : {userData.whatsappPeserta2}</p>
        <Link className="btn btn-primary" href="/registration/participant-2">Ubah</Link>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Ringkasan Registrasi</title>
      </Head>
      <div className="container d-flex flex-column gap-2 align-items-left justify-content-left vh-90">
        <h2>Ringkasan</h2>
        <h3>Instansi</h3>
        <h5>Profil</h5>
        <p>Nama Instansi            : {userData.namaInstansi}</p>
        <p>Email Instansi           : {userData.emailInstansi}</p>
        <p>Tanggal Berdiri Instansi : {userData.tanggalBerdiri}</p>
        <p>Jenis Instansi           : {userData.jenisInstansi}</p>
        <p>Jenis Cluster            : {userData.jenisCluster}</p>
        <p>Alamat Lengkap           : {userData.alamatKantor}, {userData.kotaKantor}, {userData.provinsiKantor}</p>
        <p>Jumlah Penerima Manfaat  : {userData.penerimaManfaat}</p>
        <Link className="btn btn-primary" href="/registration/instance">Ubah</Link>
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
        <Link className="btn btn-primary" href="/">Daftar</Link>
      </div>
    </>
  );
}

export default SummaryRegistration;