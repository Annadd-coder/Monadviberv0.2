import Link from 'next/link';

/** Список авторов → { cid }  */
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

// Подготовка карточек авторов
const collections = Object.keys(AUTHORS).map((id) => ({
  id,
  image: `/collections/${id}/avatar.png`,
}));

export default function HomePage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Choose an author to immerse in their vibes.</h1>

      <div style={styles.grid}>
        {collections.map((col) => (
          <div key={col.id} style={styles.card}>
            {/* Переход по картинке */}
            <Link href={`/collections/${col.id}`} legacyBehavior>
              <img src={col.image} alt={col.id} style={styles.image} />
            </Link>
            <h3 style={styles.cardTitle}>{col.id}</h3>
            {/* Простая кнопка */}
            <Link href={`/collections/${col.id}`} legacyBehavior>
              <button style={styles.button}>Click</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f9f5ff',
    minHeight: '100vh',
    textAlign: 'center',
    padding: '80px 20px',
    fontFamily: 'Poppins, sans-serif',
    color: '#4a148c',
  },
  title: { fontSize: '2.2rem', fontWeight: 700 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))',
    gap: '30px',
    justifyItems: 'center',
    marginTop: '40px',
  },
  card: {
    cursor: 'pointer',
    width: '220px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
    transition: 'transform .25s, box-shadow .25s',
  },
  image: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '8px',
  },
  button: {
    padding: '6px 14px',
    background: 'linear-gradient(45deg,#8e44ad,#c39bd3)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
