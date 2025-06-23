// pages/index.js
import Head from 'next/head';
import Link from 'next/link';

/* ───── карточки функций ───── */
const CARDS = [
  {
    title: 'Author Collections',
    img: '/about/line-art-nft-collections.png',
    text: 'Exclusive NFT collections from visionary artists.',
    href: '/collections',
    cta: 'Browse Collections',
  },
  {
    title: 'Feed',
    img: '/about/icon-feed.png',
    text: 'A real-time stream of freshly minted vibes.',
    href: '/feed',
    cta: 'Open Feed',
  },
  {
    title: 'MOAP',
    img: '/about/line-art-moap.png',
    text: 'Claim proof-of-attendance tokens at events.',
    href: '/moaps',
    cta: 'Get Your POAP',
  },
];

/* ───── футер ───── */
function Footer() {
  return (
    <footer style={{ background:'#fff', borderTop:'2px solid #D8CCFF', padding:'60px 5vw' }}>
      <div style={{ textAlign:'center', fontSize:14, color:'#4F4F5E' }}>
        Created by&nbsp;
        <strong style={{ color:'#593CCB' }}>Annad</strong> for the Monad community ·{' '}
        <a href="mailto:annaigorevna1204@gmail.com" style={{ color:'#593CCB', textDecoration:'none' }}>
          annaigorevna1204@gmail.com
        </a>
      </div>
    </footer>
  );
}

/* ───── страница ───── */
export default function Home() {
  return (
    <>
      <Head>
        <title>MonadViber • Where Art Meets Utility</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* фон */}
      <div style={{ background:'#EFEAFF', padding:'90px 0 160px' }}>
        <section
          style={{
            maxWidth:1280, margin:'0 auto', background:'#F9F7FF', borderRadius:32,
            border:'2px solid #D8CCFF', boxShadow:'0 14px 60px rgba(107,79,200,0.12)',
            padding:'0 5vw 120px', overflow:'hidden',
          }}
        >
          {/* HERO */}
          <header
            style={{
              padding:'140px 0', textAlign:'center',
              background:'radial-gradient(ellipse at top,#FFFFFF 0%,#F4EFFF 100%)',
              borderBottom:'2px solid #C9BAFF', marginBottom:80,
            }}
          >
            <h1 className="hero-title">
              <span className="line">More&nbsp;than <strong>NFTs</strong></span>
              <span className="line brand"> the MonadViber</span>
            </h1>

            <style jsx>{`
              .hero-title {
                margin: 0; line-height:1.15; font-family:'Poppins',sans-serif;
              }
              .hero-title .line {
                display:block; font-weight:700;
                font-size:clamp(2.6rem,6vw,4.2rem);
                background:linear-gradient(90deg,#6B4FC8 0%,#9877FF 100%);
                -webkit-background-clip:text; background-clip:text; color:transparent;
                text-shadow:0 2px 6px rgba(107,79,200,.25), 0 0 1px rgba(0,0,0,.2);
              }
              .hero-title strong { font-size:1.08em; }
              .hero-title .brand { font-style:italic; letter-spacing:.5px; }
            `}</style>
          </header>

          {/* карточки */}
          <div style={{ display:'grid', gap:50, gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))' }}>
            {CARDS.map(({ title,img,text,href,cta }) => (
              <article
                key={title}
                style={{
                  position:'relative',
                  background:'radial-gradient(ellipse at top,#FFFFFF 0%,#F4EFFF 100%)',
                  border:'2px solid #D8CCFF', borderRadius:24,
                  padding:'80px 32px 110px', textAlign:'center',
                  boxShadow:'0 8px 40px rgba(107,79,200,0.08)',
                }}
              >
                <img src={img} alt="" style={{ width:120, marginBottom:30 }} />
                <h3 style={{ fontSize:22, fontWeight:600, color:'#593CCB', marginBottom:16 }}>{title}</h3>
                <p style={{ fontSize:15, lineHeight:1.55, color:'#4F4F5E', minHeight:70 }}>{text}</p>
                <Link href={href} legacyBehavior>
                  <a
                    style={{
                      position:'absolute', left:'50%', bottom:-22, transform:'translateX(-50%)',
                      padding:'14px 46px', borderRadius:46, fontWeight:600, fontSize:14,
                      background:'#6B4FC8', color:'#FFF', textDecoration:'none',
                    }}
                  >
                    {cta}
                  </a>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}