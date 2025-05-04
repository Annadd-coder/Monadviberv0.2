// pages/index.js
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const cards = [
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
      text: 'Real-time stream of freshly minted vibes.',
      href: '/feed',
      cta: 'Open Feed',
    },
    {
      title: 'MOAP',
      img: '/about/line-art-moap.png',
      text: 'Claim proof-of-attendance tokens at events.',
      href: '/moap',
      cta: null, // «Soon»
    },
  ];

  return (
    <>
      <Head>
        <title>MonadViber • Where Art Meets Utility</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* ---------- PAGE BG ---------- */}
      <div style={{ background: '#EFEAFF', padding: '90px 0 160px' }}>
        {/* ---------- OUTER SHELL ---------- */}
        <section
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            background: '#F9F7FF',
            borderRadius: 32,
            border: '2px solid #D8CCFF',
            boxShadow: '0 14px 60px rgba(107,79,200,0.12)',
            padding: '80px 5vw 120px',
          }}
        >
          {/* -------- HERO «облачко» -------- */}
          <div
            style={{
              maxWidth: 960,
              margin: '0 auto 70px',
              padding: '70px 4vw',
              background: 'radial-gradient(ellipse at top,#FFFFFF 0%,#F4EFFF 100%)',
              borderRadius: 26,
              border: '2px solid #C9BAFF',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(2.2rem,5.5vw,3.2rem)',
                fontWeight: 700,
                color: '#6B4FC8',
                marginBottom: 20,
              }}
            >
              Welcome to MonadViber!
            </h1>

            <p style={{ fontSize: 18, color: '#463D6B', marginBottom: 46 }}>
              Explore NFTs &amp; Confirm Your Presence in Monad Events
            </p>
          </div>

          {/* -------- GRID OF CARDS -------- */}
          <div
            style={{
              display: 'grid',
              gap: 50,
              gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
            }}
          >
            {cards.map(({ title, img, text, href, cta }) => (
              <article
                key={title}
                style={{
                  position: 'relative',
                  background: 'radial-gradient(ellipse at top,#FFFFFF 0%,#F4EFFF 100%)',
                  border: '2px solid #D8CCFF',
                  borderRadius: 24,
                  padding: '80px 32px 110px',
                  textAlign: 'center',
                  boxShadow: '0 8px 40px rgba(107,79,200,0.08)',
                }}
              >
                <img src={img} alt="" style={{ width: 120, marginBottom: 30 }} />

                <h3 style={{ fontSize: 22, fontWeight: 600, color: '#593CCB', marginBottom: 16 }}>
                  {title}
                </h3>

                <p style={{ fontSize: 15, lineHeight: 1.55, color: '#4F4F5E', minHeight: 70 }}>{text}</p>

                {cta ? (
                  <Link href={href} legacyBehavior>
                    <a
                      style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: -22,
                        transform: 'translateX(-50%)',
                        padding: '14px 46px',
                        borderRadius: 46,
                        fontWeight: 600,
                        fontSize: 14,
                        background: '#6B4FC8',
                        color: '#FFFFFF',
                        textDecoration: 'none',
                      }}
                    >
                      {cta}
                    </a>
                  </Link>
                ) : (
                  <span
                    style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: -22,
                      transform: 'translateX(-50%)',
                      padding: '14px 46px',
                      borderRadius: 46,
                      fontWeight: 600,
                      fontSize: 14,
                      background: '#CFCFCF',
                      color: '#FFFFFF',
                    }}
                  >
                    Soon
                  </span>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}