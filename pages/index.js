// pages/index.js
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';

/* ───────── 1. трёхмерная сцена (только в клиенте) ───────── */
const AuthorPlanet = dynamic(
  () => import('../components/AuthorPlanet'),
  { ssr: false, loading: () => <p style={{textAlign:'center'}}>Loading planet…</p> }
);
/* ——— авторы ——— */
const AUTHORS = {
  twistzz:        { cid: 'bafybeif2hdabepr5je2vblwi6iivwhzne3rwmql7qhwgcn3cwhpgqqzyv4' },
  tchan4323:      { cid: 'bafybeiff2kxd43msni7hwzycq26b45ned5b5yeuzb5xz4gfiw7jp7ma3xq' },
  solncestoyanie: { cid: 'bafybeidnib5rcvipty6hy4p6wwvrc7ul37wz7alsdlebvefbh7fpjkfmce' },
  Richard:        { cid: 'bafybeiao64ba6ipurjijmga6e4hyrlsmki2bkkqxqxhx7j6uturpjpts3m' },
  miss_port:      { cid: 'bafybeianlconikn7cv6ywphrewlbjfpvvj7uxi4sjwlryu7p22v7dvg4re' },
  lzlzlz:         { cid: 'bafybeidb3kcti7jkbv33pgqpci5l3hd7usgjlxhdzvpvktn7ha7avurp7e' },
  kasyak:         { cid: 'bafybeidp6q3qkg5e3sdxrpmkwqjt3zu6m5qs2kioeeq336g7gxvqdtwjuu' },
  Ishan:          { cid: 'bafybeibspj7jah6wikgfmgxc5bmcxvxtgycqepf4zzx75c7mdp4p6vojne' },
  ghooolyache:    { cid: 'bafybeicgcphm5r3zoogtod5teypm7olodg5akpvre534edjtixex27wyha' },
  gabriel:        { cid: 'bafybeidx3u73jxyik5wcuyvxx24xbmpyqqi35yblytcapttlmupoc23pju' },
  Dohobob:        { cid: 'bafybeieaxng266fbs4s4sdaazuf7czhmat4i6skyudx2d44xnrclbgbai4' },
  DayzZzer:       { cid: 'bafybeico6ircxzelf3gsd6wd22hl3gasuclosh5mkkb2eauhko3uqh7hxa' },
  bromaxo:        { cid: 'bafybeidkhpcpckelugdjluv4tsnlj7edcb64j2kkm3dbdjakwaz3mp275u' },
  Antgeo:         { cid: 'bafybeibylnlnfj7eip4m4l5tskyjzv2xjf7jr4wocjrapeskyph4ybakzq' },
};
const AUTHOR_IDS = Object.keys(AUTHORS);

/* ───────── 3. карточки функций ───────── */
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

/* ───────── 4. футер ───────── */
function Footer() {
  return (
    <footer style={{ background:'#fff', borderTop:'2px solid #D8CCFF', padding:'60px 5vw' }}>
      <div style={{ textAlign:'center', fontSize:14, color:'#4F4F5E' }}>
        Created by <strong style={{ color:'#593CCB' }}>Annad</strong> for the Monad community ·{' '}
        <a href="mailto:annaigorevna1204@gmail.com" style={{ color:'#593CCB', textDecoration:'none' }}>
          annaigorevna1204@gmail.com
        </a>
      </div>
    </footer>
  );
}

/* ───────── 5. страница ───────── */
export default function Home() {
  return (
    <>
      <Head>
        <title>MonadViber • Where Art Meets Utility</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* глобальный фон */}
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
              position:'relative', padding:'80px 0 140px', textAlign:'center',
              background:'radial-gradient(ellipse at top,#FFFFFF 0%,#F4EFFF 100%)',
              borderBottom:'2px solid #C9BAFF', marginBottom:80,
            }}
          >
            <div style={{ maxWidth:900, margin:'0 auto' }}>
              <AuthorPlanet authors={AUTHOR_IDS} />
            </div>

            <h1 className="hero-title">
              <span className="line">More&nbsp;than <strong>NFTs</strong></span>
              <span className="line brand"> the MonadViber</span>
            </h1>

            <style jsx>{`
              .hero-title {
                margin-top:46px; line-height:1.15; text-align:center; font-family:'Poppins',sans-serif;
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