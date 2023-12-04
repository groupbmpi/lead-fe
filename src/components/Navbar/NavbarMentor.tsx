import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const NavbarMentor = () => {
  const router = useRouter();

  const isLinkActive = (href: string) => {
    return router.pathname === href;
  };

  const mentor = {
    name: "Mentor",
    category: "Cluster"
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
              <Link className={`nav-link ${isLinkActive('/mentor-dashboard') ? 'active' : ''}`} href="/mentor-dashboard">Beranda</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isLinkActive('/mentor-view-profile') ? 'active' : ''}`} href="/mentor-profile">Profil</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isLinkActive('/mentor-view-participant-status') ? 'active' : ''}`} href="/mentor-view-participant-status">Peserta</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isLinkActive('/mentor-task') ? 'active' : ''}`} href="/mentor-task">Tugas</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isLinkActive('/mentor-mentoring') ? 'active' : ''}`} href="/mentor-mentoring">Mentoring</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item d-lg-flex d-none me-2 align-items-center">
              <span className="bg-info bg-gradient rounded-pill px-3 py-1">Mentor {mentor.category}</span>
            </li>
            <li className="nav-item d-lg-flex d-none me-2 align-items-center">
              <span>{mentor.name}</span>
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
export default NavbarMentor;