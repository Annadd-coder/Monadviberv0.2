import { useState } from 'react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { WalletContext } from '../_app';

export default function CreateMoap() {
  const router = useRouter();
  const { address } = useContext(WalletContext);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  if (!address) {
    return (
      <div style={styles.container}>
        <p>Please connect your wallet to create a MOAP.</p>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newMoap = {
      id: Date.now().toString(),
      title: 'MOAP for Event',
      description: description,
      isPrivate: isPrivate,
      accessCode: isPrivate ? accessCode : null,
      image: image ? URL.createObjectURL(image) : '/images/moap.png'
    };
    const existingMoaps = JSON.parse(localStorage.getItem('moaps')) || [];
    const updatedMoaps = [...existingMoaps, newMoap];
    localStorage.setItem('moaps', JSON.stringify(updatedMoaps));
    alert('MOAP created (demo)!');
    router.push('/moaps');
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create MOAP for Your Event</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Upload event image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            style={styles.fileInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Event description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={styles.textarea}
          ></textarea>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              style={styles.checkbox}
            />{' '}
            Private Event
          </label>
        </div>
        {isPrivate && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Access Code:</label>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              style={styles.input}
            />
          </div>
        )}
        <button type="submit" style={styles.submitButton}>Create MOAP</button>
      </form>
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
  form: {
    maxWidth: '500px',
    margin: '0 auto',
    textAlign: 'left',
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#6A1B9A',
  },
  fileInput: {
    width: '100%',
    padding: '8px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    resize: 'vertical',
  },
  checkbox: {
    marginRight: '8px',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
  },
  submitButton: {
    backgroundColor: '#6A1B9A',
    width: '100%',
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
};