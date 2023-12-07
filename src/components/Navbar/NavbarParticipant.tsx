import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const NavbarParticipant = () => {
  const router = useRouter();

  const isLinkActive = (href: string) => {
    return router.pathname === href;
  };

  const participant = {
    name: "Participant"
  }
  return (
    <nav className="navbar bg-light navbar-expand-lg p-2">
      <div className="container-fluid">
        <span className="navbar-brand">
          <Image src="/logo/lead-logo-cropped.png" alt="LEAD Logo" width={369 * 0.25} height={229 * 0.25} className="d-inline-block align-text-center" />
        </span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isLinkActive('/participant-dashboard') ? 'active' : ''}`} href="/participant-dashboard">Beranda</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isLinkActive('/participant-view-module') ? 'active' : ''}`} href="/participant-view-module">Modul</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isLinkActive('/participant-view-profile') ? 'active' : ''}`} href="/participant-view-profile">Profil</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isLinkActive('/participant-view-mentor') ? 'active' : ''}`} href="/participant-view-mentor">Lihat Daftar Mentor</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isLinkActive('/participant-view-others') ? 'active' : ''}`} href="/participant-view-others">Lihat Peserta Lain</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item d-lg-flex d-none me-2 align-items-center">
              <span>Hi, {participant.name}</span>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
export default NavbarParticipant;