import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Head>
        <title>LEAD Indonesia</title>
      </Head>
      <div className="container d-flex flex-column gap-5 align-items-center justify-content-center vh-100">
        <div>
          <Image
            src="/logo/bakrie-logo.png"
            width={200}
            height={200}
            alt="Bakrie Group Logo"
          />
          <Image
            src="/logo/bcf-logo.png"
            className="mx-3"
            width={200}
            height={80}
            alt="Bakrie Center Foundation Logo"
          />
          <Image
            src="/logo/lead-logo.png"
            width={200}
            height={200}
            alt="LEAD Logo"
          />
        </div>
        <div>
          <a className="btn btn-primary" href="/instance_registration">Registrasi Peserta</a>
          <a className="btn btn-primary mx-3" href="/check_registration_status">Cek Status Registrasi</a>
          <div className="dropdown d-inline">
            <a className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              Login
            </a>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="participant_login">Peserta</a></li>
              <li><a className="dropdown-item" href="mentor_login">Mentor</a></li>
              <li><a className="dropdown-item" href="admin_login">Admin</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
