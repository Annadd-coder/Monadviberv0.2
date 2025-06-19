import { id as keccak256, toUtf8Bytes } from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).send('Method not allowed');

  const code = (req.body || '').trim().toLowerCase();
  const hash = keccak256(toUtf8Bytes(code));
  res.status(200).send(hash);
}