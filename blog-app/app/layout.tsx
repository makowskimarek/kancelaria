import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Artykuły | KNS Kancelaria Radców Prawnych', template: '%s | KNS Kancelaria Radców Prawnych' },
  description: 'Komentarze prawne i praktyczne informacje o zmianach przepisów przygotowane przez radców prawnych kancelarii.',
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kns.pl'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <header className="navbar" id="navbar">
          <div className="container navbar__inner">
            <a href={SITE_URL} className="navbar__logo">
              <img src="/logo-footer.svg" alt="KNS Kancelaria Radców Prawnych" className="navbar__logo-img" height={42} />
            </a>
            <nav className="navbar__nav" id="navMenu" aria-label="Nawigacja główna">
              <ul className="navbar__links">
                <li><a href={SITE_URL} className="nav-link">Strona główna</a></li>
                <li><a href={`${SITE_URL}/#specjalizacje`} className="nav-link">Specjalizacje</a></li>
                <li><a href={`${SITE_URL}/#o-nas`} className="nav-link">O nas</a></li>
                <li><a href="/blog" className="nav-link active">Artykuły</a></li>
                <li><a href={`${SITE_URL}/kontakt.html`} className="nav-link">Kontakt</a></li>
              </ul>
              <div className="navbar__phones">
                <a href="tel:603176037" className="navbar__phone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12.5 19.79 19.79 0 0 1 1.64 3.87 2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17.92z"/></svg>
                  603 176 037
                </a>
                <a href="tel:606411109" className="navbar__phone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12.5 19.79 19.79 0 0 1 1.64 3.87 2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17.92z"/></svg>
                  606 411 109
                </a>
              </div>
            </nav>
            <button className="navbar__hamburger" id="hamburger" aria-label="Otwórz menu" aria-expanded="false" aria-controls="navMenu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </header>

        {children}

        <footer className="footer">
          <div className="container footer__inner">
            <div className="footer__brand">
              <a href={SITE_URL} className="footer__logo-wrap">
                <img src="/logo-footer.svg" alt="KNS Kancelaria Radców Prawnych" className="footer__logo-img" height={48} />
              </a>
              <p className="footer__tagline">Profesjonalna obsługa prawna<br />dla firm i osób prywatnych.</p>
              <p className="footer__oirp">Radcowie prawni wpisani na listę<br />Okręgowej Izby Radców Prawnych w Katowicach</p>
            </div>
            <div className="footer__col">
              <h4 className="footer__heading">Nawigacja</h4>
              <ul className="footer__nav-list">
                <li><a href={SITE_URL}>Strona główna</a></li>
                <li><a href={`${SITE_URL}/#specjalizacje`}>Specjalizacje</a></li>
                <li><a href={`${SITE_URL}/#o-nas`}>O nas</a></li>
                <li><a href="/blog">Artykuły</a></li>
                <li><a href={`${SITE_URL}/kontakt.html`}>Kontakt</a></li>
              </ul>
            </div>
            <div className="footer__col">
              <h4 className="footer__heading">Kontakt</h4>
              <ul className="footer__contact-list">
                <li><a href="tel:603176037">603 176 037</a> <span>— r. pr. Nawrocki</span></li>
                <li><a href="tel:606411109">606 411 109</a> <span>— r. pr. Słania</span></li>
                <li><a href="mailto:sekretariat@ns-radcy.pl">sekretariat@ns-radcy.pl</a></li>
                <li className="footer__address">ul. Moniuszki 22/105, Bytom</li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <div className="container">
              <p>&copy; 2025 KNS Kancelaria Radców Prawnych. Wszelkie prawa zastrzeżone.</p>
            </div>
          </div>
        </footer>

        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var btn = document.getElementById('hamburger');
            var nav = document.getElementById('navMenu');
            if (!btn || !nav) return;
            btn.addEventListener('click', function() {
              var open = nav.classList.toggle('open');
              btn.classList.toggle('open', open);
              btn.setAttribute('aria-expanded', String(open));
            });
          })();
        ` }} />
      </body>
    </html>
  )
}
