// pages/monadviber.js
import Head from 'next/head';

export default function MonadViberPage() {
  return (
    <>
      <Head>
        <title>MonadViber - Where Art Meets Utility</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="page-container">
        {/* Section 1: Intro / About */}
        <section className="hero" id="intro">
          <div className="hero-content">
            <h1>What is MonadViber?</h1>
            <p>
              MonadViber is a cutting-edge platform where art meets utility.
              We bring together NFT Collections from visionary artists and
              MOAP (proof-of-attendance) for events, all in one place.
            </p>
            <p>
              Discover how our community redefines the way creators and enthusiasts
              connect through digital art and meaningful experiences.
            </p>
          </div>
          <div className="hero-illustration">
            <img src="/about/line-art-monadviber-intro.png" alt="Intro illustration" />
          </div>
        </section>

        {/* Section 2: NFT Collections */}
        <section className="section" id="collections">
          <div className="section-content">
            <h2>Author Collections</h2>
            <p>
              Explore exclusive NFT collections curated for art lovers and collectors alike.
              Each piece tells a story and connects you directly with the artist’s vision.
            </p>
            <p>
              Our streamlined marketplace makes it effortless for creators to showcase
              their digital masterpieces, and for collectors to acquire truly unique works of art.
            </p>
          </div>
          <div className="section-illustration">
            <img src="/about/line-art-nft-collections.png" alt="NFT Collections illustration" />
          </div>
        </section>

        {/* Section 3: MOAP */}
        <section className="section alt" id="moap">
          <div className="section-content">
            <h2>MOAP</h2>
            <p>
              MOAP (MonadViber’s Proof-of-Attendance) lets you confirm your presence at any event
              and receive a unique digital token as a keepsake.
            </p>
            <p>
              Whether it’s a virtual conference or a live festival, MOAP ensures that every
              attendee is recognized, unlocking exclusive rewards and commemorative NFTs.
            </p>
          </div>
          <div className="section-illustration">
            <img src="/about/line-art-moap.png" alt="MOAP illustration" />
          </div>
        </section>

        {/* Section 4: Auction Market */}
        <section className="section" id="auction">
          <div className="section-content">
            <h2>Auction Market</h2>
            <p>
              Discover our exclusive internal market designed for authors and owners.
              This is a space where digital assets meet opportunity through a fair and dynamic auction system.
            </p>
            <p>
              Engage in transparent bidding and experience a platform that celebrates creativity,
              where every bid connects passion with opportunity and each sale reflects the true value of art.
            </p>
          </div>
          <div className="section-illustration">
            <img src="/about/line-art-auction.png" alt="Auction illustration" />
          </div>
        </section>

        {/* Section 5: Community */}
        <section className="section" id="community">
          <div className="section-content">
            <h2>Join Our Community</h2>
            <p>
              At MonadViber, we believe in the power of community. Connect with fellow art enthusiasts,
              participate in collaborative projects, and shape the future of digital experiences.
            </p>
            <p>
              From interactive events to co-creation sessions with artists, our community-driven
              approach fosters creativity and meaningful connections.
            </p>
          </div>
          <div className="section-illustration">
            <img src="/about/line-art-community.png" alt="Community illustration" />
          </div>
        </section>
      </main>

      <style jsx>{`
        /* Сброс базовых отступов и коробочной модели */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          font-family: 'Poppins', sans-serif;
          background: #F4F0FF; /* very light violet */
          color: #333;
        }

        /* Контейнер для всего содержимого */
        .page-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Hero (Intro) */
        .hero {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          padding: 4rem 1rem;
          border-bottom: 1px solid #E1D4FF;
          background: #F7F3FF;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hero:hover {
          transform: scale(1.01);
          box-shadow: 0 8px 20px rgba(105, 50, 180, 0.15);
        }
        .hero-content {
          flex: 1 1 400px;
          margin: 1rem;
        }
        .hero-content h1 {
          font-size: 2.5rem;
          color: #6B4FC8;
          margin-bottom: 1rem;
        }
        .hero-content p {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .hero-illustration {
          flex: 1 1 400px;
          margin: 1rem;
          text-align: center;
        }
        .hero-illustration img {
          max-width: 100%;
          height: auto;
        }

        /* Общий стиль для секций */
        .section {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          padding: 4rem 1rem;
          border-bottom: 1px solid #E1D4FF;
          background: #F4F0FF;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .section:hover {
          transform: scale(1.01);
          box-shadow: 0 8px 20px rgba(105, 50, 180, 0.15);
        }
        .section-content {
          flex: 1 1 400px;
          margin: 1rem;
        }
        .section-content h2 {
          font-size: 2rem;
          color: #6B4FC8;
          margin-bottom: 1rem;
        }
        .section-content p {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .section-illustration {
          flex: 1 1 400px;
          margin: 1rem;
          text-align: center;
        }
        .section-illustration img {
          max-width: 100%;
          height: auto;
        }

        /* Альтернативный фон для некоторых блоков */
        .section.alt {
          background: #FBF9FF;
        }

        /* --- Адаптивные стили --- */

        /* При ширине до 992px немного уменьшим основные отступы и размеры */
        @media (max-width: 992px) {
          .hero, .section {
            padding: 3rem 1rem;
          }
          .hero-content h1 {
            font-size: 2.2rem;
          }
          .section-content h2 {
            font-size: 1.8rem;
          }
        }

        /* При ширине до 768px делаем колонки в одну строку и уменьшаем отступы ещё сильнее */
        @media (max-width: 768px) {
          .hero, .section {
            flex-direction: column;
          }
          .hero-content, .hero-illustration,
          .section-content, .section-illustration {
            margin: 1rem 0;
            flex: 1 1 100%;
          }
          .hero-content h1 {
            font-size: 2rem;
          }
          .hero-content p,
          .section-content p {
            font-size: 1rem;
          }
        }

        /* При ширине до 480px ещё сильнее уменьшаем заголовки и отступы */
        @media (max-width: 480px) {
          .hero, .section {
            padding: 2rem 1rem;
          }
          .hero-content h1 {
            font-size: 1.8rem;
          }
          .section-content h2 {
            font-size: 1.5rem;
          }
          .hero-content p,
          .section-content p {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </>
  );
}