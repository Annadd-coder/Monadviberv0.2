import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ marginTop: '80px', padding: '20px' }}>
        {children}
      </main>
    </>
  );
}