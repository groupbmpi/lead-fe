import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head'
import { useState } from 'react';

interface InstanceSummaryProps {
    registration: Record<string, string>;
}

const InstanceSummary: NextPage<InstanceSummaryProps> = ({ registration }) => {
    const [confirmedData, setConfirmedData] = useState(false);
    const [confirmedConcept, setConfirmedConcept] = useState(false);

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

    return (
        <>
            <Head>
                <title>LEAD Indonesia</title>
            </Head>
            <div className="container d-flex flex-column gap-2 align-items-left justify-content-left vh-90">
                <h2>Ringkasan</h2>
                <h3>Instansi</h3>
                <h5>Profil</h5>
                <p>Nama Instansi : {registration.namaInstansi}</p>
                <p>Email Instansi: {registration.emailInstansi}</p>
                <p>Jenis Instansi: {registration.jenisInstansi}</p>
                <p>Jenis Cluster : {registration.jenisCluster}</p>
                <p>Alamat Lengkap: {registration.alamatKantor}, {registration.kotaKantor}, {registration.provinsiKantor}</p>
                <h5>Jangkauan</h5>
                <p>Cakupan Jangkauan       : {registration.kotaJangkauan}, {registration.kotaJangkauan}</p>
                <p>Jumlah Penerima Manfaat : {registration.penerimaManfaat}</p>
                <p>Target Penerima Manfaat : {registration.targetPenerimaManfaat}</p>
                <p>Kabupaten/Kota Tercakup : {registration.kotaTercakup}</p>
                <p>Provinsi Tercakup       : {registration.provinsiTercakup}</p>
                <a className="btn btn-primary" href="/instance_registration">Ubah</a>

                <h3>Peserta</h3>
                <div className="d-flex flex-row gap-5">
                    <div className="d-flex flex-column">
                        <h5>Peserta I</h5>
                        <a className="btn btn-primary" href="/participant_registration/1">Tambah</a>
                    </div>
                    <div className="d-flex flex-column">
                        <h5>Peserta II</h5>
                        <a className="btn btn-primary" href="/participant_registration/2">Tambah</a>
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
                    <label htmlFor="confirmConcept">Saya sudah membaca dan memahami <a href="https://bit.ly/LEADBCF-2023">Concept Note</a></label>
                </div>

                <a className="btn btn-primary" href="/">Daftar</a>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    return {
        props: {
            registration: query,
        },
    };
};

export default InstanceSummary;