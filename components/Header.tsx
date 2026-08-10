import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Jordflix home">
        <span className="brand-mark">J</span><span>Jordflix</span>
      </Link>
      <nav className="nav-links" aria-label="Primary navigation">
        <Link href="/movies">Movies</Link>
        <Link href="/series">Series</Link>
        <Link href="/search" className="search-link" aria-label="Search">⌕ <span>Search</span></Link>
      </nav>
    </header>
  );
}
