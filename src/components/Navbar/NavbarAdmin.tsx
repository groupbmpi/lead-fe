import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const NavbarAdmin = () => {
  const router = useRouter();

  const isLinkActive = (href: string) => {
    return router.pathname.startsWith(href);
  };

  const admin = {
    name: "Admin",
    role: "SUPERADMIN"
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
              <Link className={`nav-link ${isLinkActive('/admin/dashboard') ? 'active' : ''}`} href="/admin/dashboard">Beranda</Link>
            </li>
            { admin.role === "SUPERADMIN" && 
              <li className="nav-item">
                <Link className={`nav-link ${isLinkActive('/admin/information-banner') ? 'active' : ''}`} href="/admin/information-banner">Information Banner</Link>
              </li>
            }
            <li className="nav-item dropdown">
              <Link className={`nav-link dropdown-toggle ${isLinkActive('/admin/view-instances') ||
                isLinkActive('/admin/view-participant') ||
                isLinkActive('/admin/view-mentor') ||
                isLinkActive('/admin/view-admin')
                ? 'active'
                : ''
                }`} href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Lihat Daftar
              </Link>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" href="/admin/view-instances">Pendaftar (Instansi)</Link></li>
                <li><Link className="dropdown-item" href="/admin/view-participant">Peserta</Link></li>
                <li><Link className="dropdown-item" href="/admin/view-mentor">Mentor</Link></li>
                { admin.role === 'SUPERADMIN' && 
                  <li><Link className="dropdown-item" href="/admin/view-admin">Admin</Link></li>
                }
              </ul>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item d-lg-flex d-none me-2 align-items-center">
              <span>Hi, {admin.name}</span>
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
export default NavbarAdmin;