import Link from 'next/link';

const collections = [
  { id: 'Annae.nad',      name: 'Annae.nad',      image: '/collections/Annae.nad/avatar.png' },
  { id: 'Pugovka_Mari',   name: 'Pugovka_Mari',   image: '/collections/Pugovka_Mari/avatar.png' },
  { id: 'akellaa2023',    name: 'akellaa2023',    image: '/collections/akellaa2023/avatar.png' },
  { id: 'daha1522',       name: 'daha1522',       image: '/collections/daha1522/avatar.png' },
  { id: 'weeklang',       name: 'weeklang',       image: '/collections/weeklang/avatar.png' },
  { id: 'n1nja0207',      name: 'n1nja0207',      image: '/collections/n1nja0207/avatar.png' },
  { id: 'lzlz0506',       name: 'lzlz0506',       image: '/collections/lzlz0506/avatar.png' },
  { id: 'twistzz666',     name: 'twistzz666',     image: '/collections/twistzz666/avatar.png' },
  { id: 'Dohobob',   name: 'Dohobob',            image: '/collections/Dohobob/avatar.png' },
  // =============== Additional New Authors ===============
  { id: 'Gabriel',        name: 'Gabriel',        image: '/collections/Gabriel/avatar.png' },
  { id: 'avader',         name: 'avader',         image: '/collections/avader/avatar.png' },
  { id: 'solncestoyaniee', name: 'solncestoyaniee', image: '/collections/solncestoyaniee/avatar.png' }
];

export default function CollectionsPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Author Collections</h1>
      <p style={styles.subtitle}>Choose an author to immerse in their creative vibes.</p>
      <div style={styles.grid}>
        {collections.map((col) => (
          <Link key={col.id} href={`/collections/${col.id}`} legacyBehavior>
            <div style={styles.card}>
              <img src={col.image} alt={col.name} style={styles.image} />
              <h3 style={styles.cardTitle}>{col.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#f9f5ff",
    minHeight: "100vh",
    textAlign: "center",
    padding: "80px 20px",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: "#4a148c"
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    fontWeight: 700
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "40px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "30px",
    justifyItems: "center",
    marginTop: "30px"
  },
  card: {
    cursor: "pointer",
    width: "220px",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease"
  },
  image: {
    width: "100%",
    borderRadius: "8px",
    marginBottom: "10px"
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: 600
  }
};