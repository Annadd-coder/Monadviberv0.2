export default function handler(req, res) {
    if (req.method !== 'POST')
      return res.status(405).json({ error: 'Method not allowed' });
  
    // ⚠️ заглушка — генерируем фейковый CID
    const fakeCid = 'bafy' + Math.random().toString(36).slice(2, 10);
    res.status(200).json({ cid: fakeCid });
  }