// pages/index.js
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { loadFull } from 'tsparticles';

// Загрузка react-tsparticles без серверного рендеринга
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="page-container">
        {/* Фон для частиц */}
        <div className="particles-background">
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
              background: { color: { value: "#EFE6FF" } },
              fpsLimit: 60,
              particles: {
                color: { value: "#A07BFF" },
                links: {
                  enable: true,
                  color: "#A07BFF",
                  distance: 150,
                  opacity: 0.4,
                },
                move: { enable: true, speed: 0.5 },
                number: {
                  density: { enable: true, area: 800 },
                  value: 30,
                },
                opacity: { value: 0.5 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } },
              },
              detectRetina: true,
            }}
          />
        </div>

        {/* Основной "облако"-контейнер для контента */}
        <div className="main-cloud">
          {/* Секция Welcome */}
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome to MonadViber!</h1>
            <p className="welcome-subtitle">
              Explore NFTs & Confirm Your Presence in Monad Events
            </p>
          </div>

          {/* Секция с карточками */}
          <div className="cards-section">
            {/* Карточка 1: Коллекции */}
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
              <a href="/collections" className="card-button">
                Browse Collections
              </a>
            </div>

            {/* Карточка 2: Auction (неактивная) */}
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

            {/* Карточка 3: MOAP (неактивная) */}
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
          /* Базовые стили */

          :root {
            /* Можно регулировать корневые размеры для удобства масштабирования */
            font-size: 16px;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Poppins', sans-serif;
          }

          /* Контейнер страницы с анимированным градиентом */
          .page-container {
            position: relative;
            min-height: 100vh;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            background: linear-gradient(135deg, #EFE6FF, #D8C3FF);
            background-size: 400% 400%;
            animation: backgroundAnimation 15s ease infinite;
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

          /* Основной "облако"-контейнер для контента */
          .main-cloud {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 1200px;
            background: #F4F0FF;
            border-radius: 40px;
            box-shadow: 0 10px 30px rgba(90, 61, 191, 0.3);
            padding: 40px;
            margin: auto;
          }

          /* Секция Welcome */
          .welcome-section {
            background: linear-gradient(
              135deg,
              #F4F0FF,
              rgb(239, 230, 247),
              #E5DAFF,
              #DCCFFF,
              #F4F0FF
            );
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
            margin-bottom: 1rem;
          }

          .welcome-subtitle {
            font-size: 1.2rem;
            color: #333;
          }

          /* Секция карточек */
          .cards-section {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            justify-content: space-between;
            margin-top: 2rem;
          }

          .card {
            background: radial-gradient(
              circle,
              #ffffff,
              #f9f3ff 70%,
              #e8d0ff 100%
            );
            border-radius: 20px;
            box-shadow: 0 8px 20px rgba(90, 61, 191, 0.2);
            padding: 20px;
            flex: 1 1 300px;
            max-width: 480px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: transform 0.3s, box-shadow 0.3s;
            margin: 0 auto; /* Чтобы карточки центрировались при одиночной колонке */
          }

          .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(90, 61, 191, 0.3);
          }

          .card-content {
            flex-grow: 1;
            min-height: 180px;
            text-align: center;
          }

          .card-icon {
            width: 220px;
            height: 220px;
            margin-bottom: 1rem;
            display: block;
            margin-left: auto;
            margin-right: auto;
          }

          .card-title {
            font-size: 1.6rem;
            color: #5A3DBF;
            margin-bottom: 10px;
          }

          .card-text {
            font-size: 1rem;
            color: #333;
            margin-bottom: 20px;
          }

          .card-button {
            display: inline-block;
            padding: 12px 24px;
            background: #A07BFF;
            color: #fff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            transition: background 0.3s, box-shadow 0.3s;
          }

          .card-button:hover {
            background: #8C65FF;
            box-shadow: 0 4px 12px rgba(90, 61, 191, 0.3);
          }

          /* Неактивные кнопки */
          .card-button.disabled {
            background: #ccc;
            pointer-events: none;
            cursor: not-allowed;
            opacity: 0.7;
          }

          /* Медиа-запросы для адаптации */

          @media (max-width: 992px) {
            /* Немного уменьшим размеры заголовков и отступы */
            .welcome-section {
              padding: 40px 20px;
              margin: 40px auto 20px;
            }

            .welcome-title {
              font-size: 2.2rem;
            }

            .welcome-subtitle {
              font-size: 1.1rem;
            }

            .main-cloud {
              padding: 30px;
            }

            .card-icon {
              width: 200px;
              height: 200px;
            }

            .card-title {
              font-size: 1.4rem;
            }
          }

          @media (max-width: 768px) {
            .welcome-title {
              font-size: 2rem;
            }

            .cards-section {
              flex-direction: column;
              gap: 25px;
              align-items: center;
            }

            .card {
              max-width: 400px;
            }
          }

          @media (max-width: 480px) {
            .welcome-title {
              font-size: 1.8rem;
            }

            .welcome-subtitle {
              font-size: 1rem;
            }

            .card-icon {
              width: 160px;
              height: 160px;
            }

            .card-title {
              font-size: 1.2rem;
            }

            .card-text {
              font-size: 0.9rem;
            }

            .card {
              padding: 16px;
              border-radius: 16px;
            }
          }
        `}</style>
      </div>
    </>
  );
}