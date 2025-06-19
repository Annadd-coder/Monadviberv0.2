/** next.config.mjs — ESM */
export default {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'gateway.pinata.cloud' },
      { protocol: 'https', hostname: '*.ipfs.dweb.link' },
    ],
  },
};