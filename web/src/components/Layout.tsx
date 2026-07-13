import { Link, NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="app-shell">
      <div className="app-window" role="application" aria-label="Library of Lies window">
        <header className="window-title-bar">
          <div className="window-title-left">
            <span className="window-app-dot" aria-hidden="true" />
            <Link to="/" className="window-title-link" aria-label="Go to homepage">
              <p className="window-title">Library of Lies</p>
            </Link>
          </div>
          <p className="window-title-note">Deception Data Archive</p>
        </header>

        <div className="window-menu-bar" aria-label="Application menu">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'menu-link menu-link-active' : 'menu-link'
            }
          >
            Datasets
          </NavLink>
          <NavLink
            to="/glossary"
            className={({ isActive }) =>
              isActive ? 'menu-link menu-link-active' : 'menu-link'
            }
          >
            Glossary
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'menu-link menu-link-active' : 'menu-link'
            }
          >
            About Us
          </NavLink>
        </div>

        <div className="window-body">
          <main className="page-content">
            <Outlet />
          </main>
        </div>

        <footer className="window-status-bar" aria-label="Status bar">
          <span>Connected: archive.local</span>
        </footer>
      </div>
    </div>
  )
}
