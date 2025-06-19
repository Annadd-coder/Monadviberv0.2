import { keccak256, toUtf8Bytes } from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).send('Method not allowed');

  const { hash, code } = req.body || {};
  const ok = hash &&
             code &&
             hash.toLowerCase() ===
             keccak256(toUtf8Bytes(code.trim().toLowerCase()));
  res.status(200).json(ok);
}