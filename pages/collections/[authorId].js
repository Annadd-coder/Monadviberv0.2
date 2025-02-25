import { useRouter } from 'next/router';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import contractABI from '../../src/abi/MVB.json';
import styles from './AuthorPage.module.css';

const CONTRACT_ADDRESS = "0x2b4407a24E602B95Cd73fa0FE3596Ce2bDe88bb1";
const MONAD_CHAIN_ID = 10143;
const MONAD_NETWORK = {
  chainName: "Monad Testnet",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: ["https://testnet-rpc.monad.xyz"],
  blockExplorerUrls: ["https://testnet.monadexplorer.com"],
};

// Author data with 20 phrases and 20 artworks each
const authorData = {
  "Annae.nad": {
    avatar: "/collections/Annae.nad/avatar.png",
    about: "A mysterious artist who translates emotions into colorful avant-garde imagery.",
    phrases: [
      "Embrace the monad spirit with every stroke!",
      "Create your universe, one art at a time.",
      "Let your creativity shine in every detail.",
      "Dive deep into the monad vibe.",
      "Transform inspiration into art.",
      "Your vision is your power.",
      "Every creation is a step toward greatness.",
      "Innovate, inspire, ignite!",
      "Discover the beauty within chaos.",
      "Art is the pulse of the monad.",
      "Embody the future with every piece.",
      "Let your soul speak through your art.",
      "Elevate your spirit with creative energy.",
      "Challenge norms, create new realities.",
      "Every brushstroke redefines possibility.",
      "Design the world you dream of.",
      "Harness your inner monad and soar.",
      "Unleash the magic of your imagination.",
      "Every art piece is a revolution.",
      "Transform passion into timeless art."
    ],
    artworks: [
      "/collections/Annae.nad/art1.png",
      "/collections/Annae.nad/art2.png",
      "/collections/Annae.nad/art3.png",
      "/collections/Annae.nad/art4.png",
      "/collections/Annae.nad/art5.png",
      "/collections/Annae.nad/art6.png",
      "/collections/Annae.nad/art7.png",
      "/collections/Annae.nad/art8.png",
      "/collections/Annae.nad/art9.png",
      "/collections/Annae.nad/art10.png",
      "/collections/Annae.nad/art11.png",
      "/collections/Annae.nad/art12.png",
      "/collections/Annae.nad/art13.png",
      "/collections/Annae.nad/art14.png",
      "/collections/Annae.nad/art15.png",
      "/collections/Annae.nad/art16.png",
      "/collections/Annae.nad/art17.png",
      "/collections/Annae.nad/art18.png",
      "/collections/Annae.nad/art19.png",
      "/collections/Annae.nad/art20.png"
    ],
    social: {
      twitter: "https://x.com/Anna272493"
    },
    collectionId: 1 // ID коллекции для этого автора
  },
  "Pugovka_Mari": {
    avatar: "/collections/Pugovka_Mari/avatar.png",
    about: "A tireless seeker of beauty, whose works tell visual stories.",
    phrases: [
      "Step into the monad realm and create wonders!",
      "Illuminate your journey with creative fire.",
      "Awaken your inner artist with every moment.",
      "Let art guide you through the chaos.",
      "Discover your unique creative rhythm.",
      "Express your soul in every creation.",
      "Uncover the magic behind every detail.",
      "Every masterpiece starts with a single thought.",
      "Let inspiration lead your brush.",
      "Challenge the ordinary, create the extraordinary.",
      "Color your world with passion and vision.",
      "Transform dreams into vibrant reality.",
      "Craft beauty from the unexpected.",
      "Your art is your legacy.",
      "Push boundaries and defy limits.",
      "Celebrate the wonder of creativity.",
      "Ignite the spark of imagination.",
      "Every stroke tells a story.",
      "Art is the bridge between hearts.",
      "Illuminate life with your creative light."
    ],
    artworks: [
      "/collections/Pugovka_Mari/art1.png",
      "/collections/Pugovka_Mari/art2.png",
      "/collections/Pugovka_Mari/art3.png",
      "/collections/Pugovka_Mari/art4.png",
      "/collections/Pugovka_Mari/art5.png",
      "/collections/Pugovka_Mari/art6.png",
      "/collections/Pugovka_Mari/art7.png",
      "/collections/Pugovka_Mari/art8.png",
      "/collections/Pugovka_Mari/art9.png",
      "/collections/Pugovka_Mari/art10.png",
      "/collections/Pugovka_Mari/art11.png",
      "/collections/Pugovka_Mari/art12.png",
      "/collections/Pugovka_Mari/art13.png",
      "/collections/Pugovka_Mari/art14.png",
      "/collections/Pugovka_Mari/art15.png",
      "/collections/Pugovka_Mari/art16.png",
      "/collections/Pugovka_Mari/art17.png",
      "/collections/Pugovka_Mari/art18.png",
      "/collections/Pugovka_Mari/art19.png",
      "/collections/Pugovka_Mari/art20.png"
    ],
    social: {
      twitter: "https://x.com/Pugovka_Mari"
    },
    collectionId: 2 // ID коллекции для этого автора
  },
  "akellaa2023": {
    avatar: "/collections/akellaa2023/avatar.png",
    about: "A master of unexpected forms and hidden symbols that captivate the imagination.",
    phrases: [
      "Art is the way to encode the soul.",
      "Let each stroke reveal your essence.",
      "Awaken your inner visionary.",
      "Find beauty in every fleeting moment.",
      "Listen to the silence that sparks ideas.",
      "Challenge the lines and break the molds.",
      "Art should disturb the comfortable.",
      "Your message shapes your universe.",
      "Innovation is an endless journey.",
      "Your canvas awaits fearless colors.",
      "Take a risk, discover a new world.",
      "Details carry hidden stories.",
      "Reflect your dreams in paint.",
      "Imprint your vision on reality.",
      "Art evolves with every breath.",
      "Catch the spark before it fades.",
      "Wander in the realm of creativity.",
      "Compose your masterpiece daily.",
      "Energy flows where focus goes.",
      "Unfold your soul onto the canvas."
    ],
    artworks: [
      "/collections/akellaa2023/art1.png",
      "/collections/akellaa2023/art2.png",
      "/collections/akellaa2023/art3.png",
      "/collections/akellaa2023/art4.png",
      "/collections/akellaa2023/art5.png",
      "/collections/akellaa2023/art6.png",
      "/collections/akellaa2023/art7.png"
    ],
    social: {
      twitter: "https://x.com/akela_w3?s=21"
    },
    collectionId: 3 // ID коллекции для этого автора
  },
  "daha1522": {
    avatar: "/collections/daha1522/avatar.png",
    about: "Inspired by the depths of space, exploring new dimensions of color.",
    phrases: [
      "Explore beyond the horizon of imagination.",
      "In chaos, find your own pattern.",
      "Your art is your voice—let it echo.",
      "Vibe with the monad in every creation.",
      "Starlight paints the darkness with hope.",
      "Color is a language beyond words.",
      "Unveil the galaxies within your mind.",
      "Silence can be the loudest inspiration.",
      "Space is infinite—so is creativity.",
      "Break away from the known edges.",
      "Illuminate your path with bold strokes.",
      "Art transcends the gravity of everyday life.",
      "Dive into the void of pure potential.",
      "Unlock cosmic secrets in each shade.",
      "Paint your own constellation of dreams.",
      "Thoughts can be infinite, just like stars.",
      "Reflect cosmic serenity onto canvas.",
      "Reinvent reality with cosmic wonder.",
      "Absorb the universal frequencies.",
      "Shine brighter than cosmic dust."
    ],
    artworks: [
      "/collections/daha1522/art1.png",
      "/collections/daha1522/art2.png",
      "/collections/daha1522/art3.png",
      "/collections/daha1522/art4.png",
      "/collections/daha1522/art5.png",
      "/collections/daha1522/art6.png",
      "/collections/daha1522/art7.png",
      "/collections/daha1522/art8.png",
      "/collections/daha1522/art9.png",
      "/collections/daha1522/art10.png",
      "/collections/daha1522/art11.png",
      "/collections/daha1522/art12.png"
    ],
    social: {
      twitter: "https://x.com/daha1522?s=21"
    },
    collectionId: 4 // ID коллекции для этого автора
  },
  "weeklang": {
    avatar: "/collections/weeklang/avatar.png",
    about: "A musical approach to painting: each canvas resonates with its own melody.",
    phrases: [
      "Interpret the world through vivid color.",
      "Imagination shapes our reality.",
      "Harmony starts with a single note.",
      "Transform everyday moments into art.",
      "Let the rhythm guide your brush.",
      "Blend hues like musical chords.",
      "Each stroke is a beat in your symphony.",
      "Silence is an empty canvas of sound.",
      "Compose your creative soundtrack.",
      "Visual art can sing without words.",
      "Catch the tempo of inspiration.",
      "Paint the melody only you can hear.",
      "Elevate your senses into notes.",
      "Colors dance across the staff lines.",
      "Create crescendos of imagination.",
      "Your masterpiece is your concerto.",
      "Let brushstrokes become arpeggios.",
      "Follow the cadence of your heart.",
      "Art is harmony between chaos and order.",
      "Reveal the music hidden in color."
    ],
    artworks: [
      "/collections/weeklang/art1.png",
      "/collections/weeklang/art2.png",
      "/collections/weeklang/art3.png",
      "/collections/weeklang/art4.png",
      "/collections/weeklang/art5.png",
      "/collections/weeklang/art6.png",
      "/collections/weeklang/art7.png",
      "/collections/weeklang/art8.png",
      "/collections/weeklang/art9.png",
      "/collections/weeklang/art10.png",
      "/collections/weeklang/art11.png",
      "/collections/weeklang/art12.png",
      "/collections/weeklang/art13.png",
      "/collections/weeklang/art14.png",
      "/collections/weeklang/art15.png",
      "/collections/weeklang/art16.png"
    ],
    social: {
      twitter: "https://x.com/yurii_week?s=21"
    },
    collectionId: 5 // ID коллекции для этого автора
  },
  "n1nja0207": {
    avatar: "/collections/n1nja0207/avatar.png",
    about: "A ninja style of precise strokes and hidden details creating unexpected effects.",
    phrases: [
      "Precision is the heart of any masterpiece.",
      "Slice through mediocrity with creativity.",
      "Focus on form, perfect your flow.",
      "Art is both a weapon and a shield.",
      "In stillness, find the spark of movement.",
      "Stealthy details reveal hidden stories.",
      "Strike swiftly with bold expression.",
      "Patience carves the path to brilliance.",
      "Master your craft in silent devotion.",
      "Conceal, reveal—it's all in the timing.",
      "Observe the void to shape the form.",
      "One stroke can change everything.",
      "A true ninja leaves no wasted motion.",
      "Surprise is the art of subtlety.",
      "Blur the line between art and stealth.",
      "Balance agility with precision.",
      "Embrace the shadows to find the light.",
      "Nothing is impossible if unseen.",
      "Let your creativity vanish boundaries.",
      "Flow like water, adapt like wind."
    ],
    artworks: [
      "/collections/n1nja0207/art1.png",
      "/collections/n1nja0207/art2.png",
      "/collections/n1nja0207/art3.png",
      "/collections/n1nja0207/art4.png",
      "/collections/n1nja0207/art5.png",
      "/collections/n1nja0207/art6.png",
      "/collections/n1nja0207/art7.png",
      "/collections/n1nja0207/art8.png",
      "/collections/n1nja0207/art9.png",
      "/collections/n1nja0207/art10.png",
      "/collections/n1nja0207/art11.png",
      "/collections/n1nja0207/art12.png",
      "/collections/n1nja0207/art13.png",
      "/collections/n1nja0207/art14.png",
      "/collections/n1nja0207/art15.png",
      "/collections/n1nja0207/art16.png",
      "/collections/n1nja0207/art17.png",
      "/collections/n1nja0207/art18.png",
      "/collections/n1nja0207/art19.png"
    ],
    social: {
      twitter: "https://x.com/vilo010?s=21"
    },
    collectionId: 6 // ID коллекции для этого автора
  },
  "lzlz0506": {
    avatar: "/collections/lzlz0506/avatar.png",
    about: "A modern romantic who combines technology and art into a single entity.",
    phrases: [
      "Where vision meets reality, art blossoms.",
      "Design the future you want to live in.",
      "Believe in the craft you shape.",
      "Momentum grows with each new piece.",
      "Innovation sparks the heart of creation.",
      "Merge logic and passion for perfection.",
      "Dream beyond the ordinary blueprint.",
      "Art is engineering of the soul.",
      "Your imagination is the new frontier.",
      "Sculpt your dreams with cutting-edge tools.",
      "Technology expands the canvas of ideas.",
      "Love is the catalyst for every stroke.",
      "Push the limits of what's possible.",
      "Each new angle reveals hidden potential.",
      "Build beauty from digital echoes.",
      "Reshape the world with your fingerprints.",
      "Observe the code of aesthetics.",
      "Elevate your craft with open curiosity.",
      "When art meets tech, wonders unfold.",
      "Architect emotions into visual form."
    ],
    artworks: [
      "/collections/lzlz0506/art1.png",
      "/collections/lzlz0506/art2.png",
      "/collections/lzlz0506/art3.png",
      "/collections/lzlz0506/art4.png",
      "/collections/lzlz0506/art5.png",
      "/collections/lzlz0506art6.png",
      "/collections/lzlz0506/art7.png",
      "/collections/lzlz0506art8.png",
      "/collections/lzlz0506/art9.png",
      "/collections/lzlz0506/art10.png"
    ],
    social: {
      twitter: "https://x.com/velicko_aleksej?s=21"
    },
    collectionId: 7 // ID коллекции для этого автора
  },
  "twistzz666": {
    avatar: "/collections/twistzz666/avatar.png",
    about: "An artist of dark shades, where hope and magic still gleam.",
    phrases: [
      "Darkness fuels the light of creativity.",
      "Twist your perspective, find new paths.",
      "Embrace chaos to birth new forms.",
      "Unleash the shades of your imagination.",
      "From shadows, brilliance emerges.",
      "Contrasts highlight hidden truths.",
      "Dance with the darker side of art.",
      "Stir the night to wake the dawn.",
      "Fragments of fear can spark genius.",
      "Mystery drips from every brushstroke.",
      "Dragons lurk where few dare to wander.",
      "Delve deeper to find your spark.",
      "Complexity holds a certain beauty.",
      "Between black and white lies truth.",
      "Taste the abyss to savor the light.",
      "Confront the void to find substance.",
      "Art thrives in the unknown corners.",
      "Let the shadow speak its story.",
      "Weave midnight into vivid illusions.",
      "Descend to ascend in creative rapture."
    ],
    artworks: [
      "/collections/twistzz666/art1.png",
      "/collections/twistzz666/art2.png",
      "/collections/twistzz666/art3.png",
      "/collections/twistzz666/art4.png",
      "/collections/twistzz666/art5.png",
      "/collections/twistzz666/art6.png",
      "/collections/twistzz666/art7.png",
      "/collections/twistzz666/art8.png",
      "/collections/twistzz666/art9.png",
      "/collections/twistzz666/art10.png"
    ],
    social: {
      twitter: "https://x.com/twistzz_eth?s=21"
    },
    collectionId: 8 // ID коллекции для этого автора
  },
  "Dohobob": {
    avatar: "/collections/Dohobob/avatar.png",
    about: "Soft pastel tones and powerful emotions—a style that captivates the heart.",
    phrases: [
      "Let your heart dream in vivid colors.",
      "From softness, art is born.",
      "Shape your visions gently yet firmly.",
      "Speak truth in every hue you choose.",
      "Tender hues can convey bold feelings.",
      "Each pastel tone whispers a secret.",
      "Dive into a gentle palette of wonder.",
      "Embrace subtlety to convey power.",
      "Delicacy can shake the deepest core.",
      "Uncover hope in the faintest shades.",
      "Let emotions blend in pastel harmony.",
      "Radiate kindness through color choice.",
      "Art doesn't need to shout to be heard.",
      "A gentle stroke can spark a revolution.",
      "Show courage in a soft arrangement.",
      "Balance is found in understated tones.",
      "Allow tenderness to conquer fear.",
      "Let pastel storms swirl with passion.",
      "Pour your soul into a quiet rainbow."
    ],
    artworks: [
      "/collections/Dohobob/art1.png",
      "/collections/Dohobob/art2.png",
      "/collections/Dohobob/art3.png",
      "/collections/Dohobob/art4.png",
      "/collections/Dohobob/art5.png",
      "/collections/Dohobob/art6.png",
      "/collections/Dohobob/art7.png",
      "/collections/Dohobob/art8.png",
      "/collections/Dohobob/art9.png",
      "/collections/Dohobob/art10.png",
      "/collections/Dohobob/art11.png",
      "/collections/Dohobob/art12.png",
      "/collections/Dohobob/art13.png",
      "/collections/Dohobob/art14.png",
      "/collections/Dohobob/art15.png",
      "/collections/Dohobob/art16.png",
      "/collections/Dohobob/art17.png",
      "/collections/Dohobob/art18.png",
      "/collections/Dohobob/art19.png",
      "/collections/Dohobob/art20.png"
    ],
    social: {
      twitter: "https://x.com/dohobobmonad?s=21"
    },
    collectionId: 9 // ID коллекции для этого автора
  },
  "Gabriel": {
    avatar: "/collections/Gabriel/avatar.png",
    about: "An enigmatic storyteller who unveils hidden secrets through each brushstroke.",
    phrases: [
      "Whispered secrets unlock the realm of art.",
      "Every stroke unveils hidden truths.",
      "Embrace the mystery woven in each line.",
      "Dive into the enigma of artistic expression.",
      "Illuminate the unseen with your vision.",
      "Mystery fuels the heart of creativity.",
      "Let secrets flow from your brush.",
      "The hidden whispers of art speak loud.",
      "Unravel the mystery behind every hue.",
      "Your art conceals deeper stories.",
      "Discover the beauty in what remains unsaid.",
      "Silent secrets inspire bold creativity.",
      "Every hidden detail tells a story.",
      "Unlock the mystery of the unseen canvas.",
      "Art is the language of hidden dreams.",
      "Find truth in the whispers of color.",
      "Unveil the secrets behind each masterpiece.",
      "Let your art be the keeper of mysteries.",
      "Every brushstroke reveals a secret world.",
      "Embrace the enigma, express the unspoken."
    ],
    artworks: [
      "/collections/Gabriel/art1.png",
      "/collections/Gabriel/art2.png",
      "/collections/Gabriel/art3.png",
      "/collections/Gabriel/art4.png",
      "/collections/Gabriel/art5.png",
      "/collections/Gabriel/art6.png",
      "/collections/Gabriel/art7.png",
      "/collections/Gabriel/art8.png",
      "/collections/Gabriel/art9.png",
      "/collections/Gabriel/art10.png"
    ],
    social: {
      twitter: "https://x.com/sekret_off"
    },
    collectionId: 10 // ID коллекции для этого автора
  },
  "avader": {
    avatar: "/collections/avader/avatar.png",
    about: "A bold visionary challenging the norm with avant-garde expressions and fierce creativity.",
    phrases: [
      "Challenge the norm with rebellious strokes.",
      "Break the chains of conventional art.",
      "Defy expectations with every creation.",
      "Rebel against the ordinary and ignite your canvas.",
      "Unleash your inner rebel through vivid colors.",
      "Dare to disrupt with each brushstroke.",
      "Art is revolution in its purest form.",
      "Fight conformity with creative defiance.",
      "Every line is a battle cry against mediocrity.",
      "Stand strong in the face of artistic conformity.",
      "Let your art echo the call of rebellion.",
      "Disrupt, defy, and redefine the narrative.",
      "Your vision is a force against the mundane.",
      "Every masterpiece is a statement of defiance.",
      "Harness the power of artistic insurgency.",
      "Shatter boundaries with bold expression.",
      "Art is your weapon; creativity, your shield.",
      "Unmask the reality with rebellious art.",
      "Embrace the chaos and create the extraordinary.",
      "Rise above the ordinary with a rebellious soul."
    ],
    artworks: [
      "/collections/avader/art1.png",
      "/collections/avader/art2.png",
      "/collections/avader/art3.png",
      "/collections/avader/art4.png",
      "/collections/avader/art5.png",
      "/collections/avader/art6.png",
      "/collections/avader/art7.png",
      "/collections/avader/art8.png",
      "/collections/avader/art9.png",
      "/collections/avader/art10.png"
    ],
    social: {
      twitter: "https://x.com/AVaderDegen"
    },
    collectionId: 11 // ID коллекции для этого автора
  },
  "solncestoyaniee": {
    avatar: "/collections/solncestoyaniee/avatar.png",
    about: "An artist whose work radiates the warmth and intensity of the sun, blending light and color in every creation.",
    phrases: [
      "Let the light of your art illuminate the soul.",
      "Capture the warmth of the sun in every stroke.",
      "Radiate brilliance through your creative fire.",
      "Every hue is a ray of hope.",
      "Infuse your canvas with the energy of the sun.",
      "Bright colors inspire infinite possibilities.",
      "Allow your art to bask in the glow of creativity.",
      "Shine brightly, even in the darkest moments.",
      "Transform sunlight into a masterpiece.",
      "The warmth of your vision lights the way.",
      "Let your art be a beacon of radiant hope.",
      "Every stroke carries the brilliance of the sun.",
      "Illuminate the world with your vibrant colors.",
      "Capture the essence of sunlight on your canvas.",
      "Let the glow of creativity warm your spirit.",
      "Art is the reflection of the sun within us.",
      "Every color sings with the energy of light.",
      "Find harmony in the spectrum of life.",
      "Let passion and light merge on your canvas.",
      "Radiate love and creativity with every brushstroke."
    ],
    artworks: [
      "/collections/solncestoyaniee/art1.png",
      "/collections/solncestoyaniee/art2.png",
      "/collections/solncestoyaniee/art3.png",
      "/collections/solncestoyaniee/art4.png",
      "/collections/solncestoyaniee/art5.png",
      "/collections/solncestoyaniee/art6.png",
      "/collections/solncestoyaniee/art7.png",
      "/collections/solncestoyaniee/art8.png",
      "/collections/solncestoyaniee/art9.png",
      "/collections/solncestoyaniee/art10.png"
    ],
    social: {
      twitter: "https://x.com/solncestoyaniee"
    },
    collectionId: 12 // ID коллекции для этого автора
  }
};

export default function AuthorPage() {
  const router = useRouter();
  const { authorId } = router.query;

  const [currentPhrase, setCurrentPhrase] = useState("");
  const [currentArt, setCurrentArt] = useState("");
  const [mintStatus, setMintStatus] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [collectionSupply, setCollectionSupply] = useState(0);
  const [collectionId, setCollectionId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const data = useMemo(() => authorData[authorId], [authorId]);

  // Инициализация данных коллекции
  useEffect(() => {
    if (authorId && data) {
      setCurrentPhrase(data.phrases[Math.floor(Math.random() * data.phrases.length)]);
      setCurrentArt(data.artworks[Math.floor(Math.random() * data.artworks.length)]);
      setCollectionId(data.collectionId); // ID коллекции (для дальнейшего использования)
    }
  }, [authorId, data]);

  // Функция для рандомизации фразы и арта
  const randomize = useCallback(() => {
    setCurrentPhrase(data.phrases[Math.floor(Math.random() * data.phrases.length)]);
    setCurrentArt(data.artworks[Math.floor(Math.random() * data.artworks.length)]);
  }, [data]);

  // Переключение на Monad Testnet
  const switchToMonadNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${MONAD_CHAIN_ID.toString(16)}` }],
      });
      return true;
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [MONAD_NETWORK],
          });
          return true;
        } catch (addError) {
          console.error("Failed to add Monad network:", addError);
          return false;
        }
      }
      console.error("Failed to switch to Monad network:", switchError);
      return false;
    }
  }, []);

  // Получение информации о коллекции из контракта
  const getCollectionInfo = useCallback(async () => {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider);
    try {
      const collection = await contract.collections(collectionId);
      setCollectionSupply(collection.currentSupply);
    } catch (error) {
      console.error("Error fetching collection info:", error);
    }
  }, [collectionId]);

  useEffect(() => {
    if (collectionId) {
      getCollectionInfo();
    }
  }, [collectionId, getCollectionInfo]);

  // Функция минтинга NFT (для всех пользователей)
  const mintNFT = useCallback(async () => {
    try {
      setIsMinting(true);
      setMintStatus(null);

      if (!window.ethereum) {
        alert("MetaMask not found! Please install MetaMask.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== BigInt(MONAD_CHAIN_ID)) {
        const switched = await switchToMonadNetwork();
        if (!switched) {
          alert("Please switch to Monad Testnet to mint NFTs");
          setIsMinting(false);
          return;
        }
      }

      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

      const mintPrice = await contract.DEFAULT_MINT_PRICE();
      const tx = await contract.mint(collectionId, { value: mintPrice });
      setMintStatus({ status: "pending", txHash: tx.hash });

      await tx.wait();
      setMintStatus({ status: "success", txHash: tx.hash });
      setCollectionSupply(prev => Number(prev) + 1);
    } catch (error) {
      console.error("Error minting NFT:", error);
      setMintStatus({ status: "error", message: error.reason || error.message });
    } finally {
      setIsMinting(false);
    }
  }, [collectionId, switchToMonadNetwork]);

  // Функция для проверки, является ли текущий кошелёк администратором
  useEffect(() => {
    async function checkAdmin() {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider);
      // Используем методы напрямую без ethers.utils
      const adminRole = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));
      try {
        const hasAdmin = await contract.hasRole(adminRole, userAddress);
        setIsAdmin(hasAdmin);
      } catch (error) {
        console.error("Error checking admin role:", error);
      }
    }
    checkAdmin();
  }, []);

  // Функция инициализации коллекции через вызов createCollection (только для администратора)
  const initializeCollection = useCallback(async () => {
    try {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
  
      // Параметры для createCollection:
      const royaltyRecipient = await signer.getAddress();
      const royaltyPercentage = 500; // 5%
      const name = authorId;
      const baseImageURI = `collections/${authorId}`; // настройте по необходимости
      const mintPrice = ethers.parseEther("0.05"); // исправлено: без ethers.utils
  
      const tx = await contract.createCollection(
        name,
        baseImageURI,
        mintPrice,
        royaltyRecipient,
        royaltyPercentage
      );
      console.log("Collection initialization tx sent:", tx.hash);
      await tx.wait();
      console.log("Collection initialized successfully");
      getCollectionInfo();
    } catch (error) {
      console.error("Error initializing collection:", error);
      alert("Error initializing collection: " + (error.reason || error.message));
    }
  }, [authorId, getCollectionInfo]);

  // Функция для шаринга в Twitter (без изменений)
  const shareOnTwitter = useCallback(() => {
    const siteLink = "https://monadviber.com";
    const tweetText = `Phrase of the day from ${authorId}: "${currentPhrase}"\nDive into the vibes of Monad's art: ${siteLink}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, "_blank");
  }, [authorId, currentPhrase]);

  if (!authorId || !data) {
    return (
      <div className={styles.container}>
        <h1>Author not found</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Collection: {authorId}</h1>
      <p className={styles.about}>{data.about}</p>

      <div className={styles.supplyInfo}>
        <p>Minted: {collectionSupply} / 1000</p>
        {collectionSupply >= 1000 && <p className={styles.soldOut}>SOLD OUT!</p>}
      </div>

      {/* Если пользователь админ, показываем кнопку инициализации коллекции */}
      {isAdmin && (
        <div className={styles.adminSection}>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(130,89,241,0.8)" }}
            whileTap={{ scale: 0.95 }}
            className={styles.adminButton}
            onClick={initializeCollection}
          >
            Initialize Collection
          </motion.button>
        </div>
      )}

      <div className={styles.randomizer}>
        <img src={currentArt} alt="Artwork" className={styles.artImage} />
        <p className={styles.phrase}>{currentPhrase}</p>

        {mintStatus && (
          <div className={styles.mintStatusContainer}>
            {mintStatus.status === "pending" && (
              <div className={styles.mintStatusPending}>
                <p>Transaction pending...</p>
                <a
                  href={`https://testnet-explorer.monad.xyz/tx/${mintStatus.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mintStatusLink}
                >
               
                </a>
              </div>
            )}
            {mintStatus.status === "success" && (
              <div className={styles.mintStatusSuccess}>
                <p>🎉 NFT Minted Successfully!</p>
                <a
                  href={`https://testnet-explorer.monad.xyz/tx/${mintStatus.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mintStatusLink}
                >
                  
                </a>
              </div>
            )}
            {mintStatus.status === "error" && (
              <div className={styles.mintStatusError}>
                <p>❌ Error: {mintStatus.message}</p>
              </div>
            )}
          </div>
        )}

        <div className={styles.buttonGroup}>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(130,89,241,0.8)" }}
            whileTap={{ scale: 0.95 }}
            className={styles.actionButton}
            onClick={mintNFT}
            disabled={isMinting || collectionSupply >= 1000}
          >
            {isMinting ? "Minting..." : collectionSupply >= 1000 ? "Sold Out" : "Mint NFT"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(130,89,241,0.8)" }}
            whileTap={{ scale: 0.95 }}
            className={styles.actionButton}
            onClick={shareOnTwitter}
          >
            Share on X
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(130,89,241,0.8)" }}
            whileTap={{ scale: 0.95 }}
            className={styles.actionButton}
            onClick={randomize}
          >
            Try Again
          </motion.button>
        </div>
      </div>

      <div className={styles.subscribeSection}>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(130,89,241,0.8)" }}
          whileTap={{ scale: 0.95 }}
          className={styles.subscribeButton}
          onClick={() => window.open(data.social.twitter, "_blank")}
        >
          Follow on X
        </motion.button>
      </div>

      <div className={styles.description}>
        <p>
          "Every piece of art reflects the creator's soul, and every phrase sparks inspiration!"
        </p>
      </div>
    </div>
  );
}