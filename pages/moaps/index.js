import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';
import { WalletContext } from '../_app';

export default function MoapsPage() {
  const { address } = useContext(WalletContext);
  const [moaps, setMoaps] = useState([]);

  useEffect(() => {
    const storedMoaps = JSON.parse(localStorage.getItem('moaps')) || [];
    setMoaps(storedMoaps);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>MOAP Section</h1>
      <p style={styles.description}>
        Here you can mint MOAP tokens for participation in events on Monad. 
        MOAP is your proof-of-attendance, showing you were truly there.
        Creating new MOAPs requires a connected wallet.
      </p>
      <div style={styles.moapList}>
        {moaps.length === 0 ? (
          <p style={styles.noMoaps}>No MOAPs created yet.</p>
        ) : (
          moaps.map((moap) => (
            <div key={moap.id} style={styles.moapCard}>
              <img src={moap.image} alt={moap.title} style={styles.moapImage} />
              <p style={styles.moapTitle}>{moap.title}</p>
              <button
                style={styles.mintButton}
                onClick={() => {
                  if (address) {
                    alert('Minting MOAP (demo) for ' + moap.title);
                  } else {
                    alert('Please connect your wallet to mint MOAP');
                  }
                }}
              >
                Mint MOAP
              </button>
            </div>
          ))
        )}
      </div>
      <div style={styles.createSection}>
        <Link href="/moaps/create">
          <button style={styles.createButton}>Create MOAP for Your Event</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'linear-gradient(135deg, #FFFFFF, #E1BEE7)',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2.5rem',
    color: '#6A1B9A',
    marginBottom: '20px',
  },
  description: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '30px',
  },
  moapList: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
    marginTop: '30px',
  },
  moapCard: {
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '220px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    },
  },
  moapImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
  moapTitle: {
    fontSize: '1.2rem',
    color: '#333',
    margin: '10px 0',
  },
  mintButton: {
    backgroundColor: '#6A1B9A',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    marginTop: '15px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(106,27,154,0.3)',
    },
  },
  createSection: {
    marginTop: '40px',
  },
  createButton: {
    backgroundColor: '#6A1B9A',
    padding: '12px 24px',
    borderRadius: '6px',
    fontWeight: 'bold',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(106,27,154,0.3)',
    },
  },
  noMoaps: {
    fontSize: '1.2rem',
    color: '#555',
  },
};