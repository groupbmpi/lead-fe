import { redirectLoggedInUser } from '@/utils/auth';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    redirectLoggedInUser();
  });
  return (
    <>
      <Head>
        <title>LEAD Indonesia</title>
      </Head>
      <div className="container d-flex flex-column gap-5 align-items-center justify-content-center vh-100">
        <div className="d-flex flex-column flex-lg-row align-items-center">
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
        <div className="d-flex flex-column flex-lg-row align-items-center gap-3">
          <Link className="btn btn-primary w-100" href="/registration/instance">Registrasi Peserta</Link>
          <Link className="btn btn-primary w-100 mx-3" href="/check-registration-status">Cek Status Registrasi</Link>
          <div className="dropdown d-inline h-100 w-100">
            <a className="btn btn-primary dropdown-toggle h-100 w-100 d-flex align-items-center justify-content-center" data-bs-toggle="dropdown" aria-expanded="false">
              Login
            </a>
            <ul className="dropdown-menu">
              <li><Link className="dropdown-item" href="/participant-login">Peserta</Link></li>
              <li><Link className="dropdown-item" href="/mentor-login">Mentor</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
