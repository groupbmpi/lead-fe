import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const NavbarGuest = () => {
  const router = useRouter();

  const isLinkActive = (href: string) => {
    return router.pathname === href;
  };
  return (
    <nav className="navbar bg-light navbar-expand-lg p-2">
      <div className="container-fluid">
        <span className="navbar-brand">
          <Image src="/logo/lead-logo-cropped.png" alt="LEAD Logo" width={369 * 0.25} height={229 * 0.25} className="d-inline-block align-text-center" />
        </span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isLinkActive('/instance-registration') ? 'active' : ''}`} href="/instance-registration">Registrasi Peserta</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isLinkActive('/check-registration-status') ? 'active' : ''}`} href="/check-registration-status">Cek Status Registrasi</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <Link className={`nav-link dropdown-toggle ${isLinkActive('/participant-login') ||
                isLinkActive('/mentor-login') ||
                isLinkActive('/admin-login')
                ? 'active'
                : ''
                }`} href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Login
              </Link>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" href="/participant-login">Peserta</Link></li>
                <li><Link className="dropdown-item" href="/mentor-login">Mentor</Link></li>
                <li><Link className="dropdown-item" href="/admin-login">Admin</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
export default NavbarGuest;