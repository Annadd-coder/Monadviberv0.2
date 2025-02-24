// pages/index.js
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { loadFull } from 'tsparticles';

const Particles = dynamic(() => import('react-tsparticles'), { ssr: false });

export default function HomePage() {
  const particlesInit = async (engine) => {
    if (engine && typeof engine.checkVersion === 'function') {
      await loadFull(engine);
    }
  };

  return (
    <>
      <Head>
        <title>MonadViber</title>
      </Head>
      <div className="page-container">
        {/* Фоновый элемент для частиц */}
        <div className="particles-background">
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
              background: { color: { value: "#EFE6FF" } },
              fpsLimit: 60,
              particles: {
                color: { value: "#A07BFF" },
                links: { enable: true, color: "#A07BFF", distance: 150, opacity: 0.4 },
                move: { enable: true, speed: 0.5 },
                number: { density: { enable: true, area: 800 }, value: 30 },
                opacity: { value: 0.5 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } },
              },
              detectRetina: true,
            }}
          />
        </div>

        {/* Основной контейнер ("облако") для всего контента */}
        <div className="main-cloud">
          {/* Welcome Section с анимированным градиентом */}
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome to MonadViber!</h1>
            <p className="welcome-subtitle">
              Explore NFTs & Confirm Your Presence in Monad Events
            </p>
          </div>

          {/* Карточки */}
          <div className="cards-section">
            {/* Коллекции – остаётся кликабельным */}
            <div className="card">
              <div className="card-content">
                <img
                  src="/about/icon-collections.png"
                  alt="Author Collections"
                  className="card-icon"
                />
                <h2 className="card-title">Author Collections</h2>
                <p className="card-text">
                  Discover exclusive NFT collections from visionary artists curated for art enthusiasts.
                </p>
              </div>
              <a href="/collections" className="card-button">Browse Collections</a>
            </div>

            {/* Auction – кнопка с текстом Soon, не кликабельна */}
            <div className="card">
              <div className="card-content">
                <img
                  src="/about/icon-auction.png"
                  alt="Auction"
                  className="card-icon"
                />
                <h2 className="card-title">Auction</h2>
                <p className="card-text">
                  Participate in our upcoming auctions for exclusive NFT collectibles.
                </p>
              </div>
              <span className="card-button disabled">Soon</span>
            </div>

            {/* MOAP – кнопка с текстом Soon, не кликабельна */}
            <div className="card">
              <div className="card-content">
                <img
                  src="/about/icon-moap.png"
                  alt="MOAP"
                  className="card-icon"
                />
                <h2 className="card-title">MOAP</h2>
                <p className="card-text">
                  Confirm your attendance at events and earn unique NFT proofs.
                </p>
              </div>
              <span className="card-button disabled">Soon</span>
            </div>
          </div>
        </div>

        <style jsx>{`
          /* Общий фон страницы с анимированным градиентом */
          .page-container {
            position: relative;
            min-height: 100vh;
            overflow: hidden;
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #EFE6FF, #D8C3FF);
            background-size: 400% 400%;
            animation: backgroundAnimation 15s ease infinite;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }
          @keyframes backgroundAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          /* Фон для частиц */
          .particles-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
          }
          /* Единый контейнер ("облако") */
          .main-cloud {
            position: relative;
            z-index: 1;
            background: #F4F0FF;
            border-radius: 40px;
            box-shadow: 0 10px 30px rgba(90, 61, 191, 0.3);
            padding: 40px;
            max-width: 1200px;
            width: 100%;
          }
          /* Welcome Section с анимированным градиентом */
          .welcome-section {
            background: linear-gradient(135deg, #F4F0FF, rgb(239, 230, 247), #E5DAFF, #DCCFFF, #F4F0FF);
            background-size: 400% 400%;
            animation: welcomeGradient 15s ease infinite;
            border: 2px solid #D8C3FF;
            border-radius: 50px;
            padding: 60px 40px;
            text-align: center;
            max-width: 800px;
            width: 90%;
            margin: 60px auto 40px;
          }
          @keyframes welcomeGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .welcome-title {
            font-size: 2.8rem;
            color: #5A3DBF;
            margin: 0;
          }
          .welcome-subtitle {
            margin-top: 20px;
            font-size: 1.2rem;
            color: #333;
          }
          /* Карточки */
          .cards-section {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            justify-content: space-between;
          }
          .card {
            background: radial-gradient(circle, #ffffff, #f9f3ff 70%, #e8d0ff 100%);
            border-radius: 20px;
            box-shadow: 0 8px 20px rgba(90, 61, 191, 0.2);
            padding: 20px;
            flex: 1 1 300px;
            max-width: 480px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: transform 0.3s;
          }
          .card:hover {
            transform: translateY(-4px);
          }
          .card-content {
            flex-grow: 1;
            min-height: 200px;
          }
          .card-icon {
            width: 250px;
            height: 250px;
            margin-bottom: 10px;
            display: block;
            margin-left: auto;
            margin-right: auto;
          }
          .card-title {
            font-size: 1.8rem;
            color: #5A3DBF;
            margin-bottom: 10px;
            text-align: center;
          }
          .card-text {
            font-size: 1rem;
            color: #333;
            margin-bottom: 20px;
            text-align: center;
          }
          .card-button {
            display: inline-block;
            padding: 12px 24px;
            background: #A07BFF;
            color: #fff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.3s, box-shadow 0.3s;
            text-align: center;
          }
          .card-button:hover {
            background: #8C65FF;
            box-shadow: 0 4px 12px rgba(90, 61, 191, 0.3);
          }
          /* Стили для неактивных кнопок */
          .card-button.disabled {
            background: #ccc;
            pointer-events: none;
            cursor: not-allowed;
            opacity: 0.7;
          }
          @media (max-width: 768px) {
            .cards-section {
              flex-direction: column;
              align-items: center;
            }
            .card {
              max-width: 100%;
              width: 100%;
            }
          }
          /* Центрирование и увеличение картинки в секции Hero */
          .hero-illustration {
            flex: 1 1 400px;
            margin: 1rem;
            text-align: center;
          }
          .hero-illustration img {
            width: 80%;
            height: auto;
            margin: 0 auto;
            display: block;
          }
        `}</style>
      </div>
    </>
  );
}