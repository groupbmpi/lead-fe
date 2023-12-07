import { useRegistration } from '@/contexts/RegistrationContext';
import withRegistrationProvider from '@/contexts/withRegistrationProvider';
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import React from 'react';
import FolderLayout from './_layout';

const SummaryRegistration = () => {
    const { userData, setUserData } = useRegistration();
    const [confirmedData, setConfirmedData] = useState(false);
    const [confirmedConcept, setConfirmedConcept] = useState(false);
    const [showTambahButton1, setShowTambahButton1] = useState(true);
    const [participant1Data, setParticipant1Data] = useState({});
    useEffect(() => {
        console.log(userData);
    }, [userData]);

    //   const [error, setError] = useState('')

    //   if (!confirmedData) {
    //     if(!error){
    //         setError('Pastikan data yang diisi sudah benar');
    //     }
    //     return;
    //   }

    //   if (!confirmedConcept) {
    //     if(!error){
    //         setError('Pastikan anda sudah membaca dan memahami Concept Note');
    //     }
    //     return;
    //   }

    //   setError('')

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
                {true && (
                    <div>
                        <p>Nama Peserta               : {userData.namaPeserta1}</p>
                        <p>Email Peserta              : {userData.emailPeserta1}</p>
                        <p>Pendidikan Terakhir Peserta: {userData.pendidikanPeserta1}</p>
                        <p>No Whatsapp Peserta        : {userData.pendidikanPeserta1}</p>
                        <Link className="btn btn-primary" href="/registration/participant1">Ubah</Link>
                    </div>
                )}
            </div>
        );
    };

    return (
        <FolderLayout>
            <Head>
                <title>Ringkasan Registrasi</title>
            </Head>
            <div className="container d-flex flex-column gap-2 align-items-left justify-content-left vh-90">
                <h2>Ringkasan</h2>
                <h3>Instansi</h3>
                <h5>Profil</h5>
                <p>Nama Instansi : {userData.namaInstansi}</p>
                <p>Email Instansi: {userData.emailInstansi}</p>
                <p>Jenis Instansi: {userData.jenisInstansi}</p>
                <p>Jenis Cluster : {userData.jenisCluster}</p>
                <p>Alamat Lengkap: {userData.alamatKantor}, {userData.kotaKantor}, {userData.provinsiKantor}</p>
                <h5>Jangkauan</h5>
                <p>Cakupan Jangkauan       : {userData.kotaJangkauan}, {userData.kotaJangkauan}</p>
                <p>Jumlah Penerima Manfaat : {userData.penerimaManfaat}</p>
                <p>Target Penerima Manfaat : {userData.targetPenerimaManfaat}</p>
                <p>Kabupaten/Kota Tercakup : {userData.kotaTercakup}</p>
                <p>Provinsi Tercakup       : {userData.provinsiTercakup}</p>
                <Link className="btn btn-primary" href="/registration/instance">Ubah</Link>

                <h3>Peserta</h3>
                <div className="row">
                    {showTambahButton1 && (
                        <div className="col">
                            <div className="d-flex flex-column">
                                <h5>Peserta I</h5>
                                <Link className="btn btn-primary" href="/registration/participant1">Tambah</Link>
                            </div>
                        </div>
                    )}
                    {true && renderParticipant1Data()}
                    <div className="col">
                        <div className="d-flex flex-column">
                            <h5>Peserta II</h5>
                            <Link className="btn btn-primary" href="/registration/participant2">Tambah</Link>
                        </div>
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
        </FolderLayout>
    );
}

export default SummaryRegistration;