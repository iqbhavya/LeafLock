export const BOTANICAL_KEYS = [
  {
    id: 'oak-leaf',
    name: 'Oak Leaf',
    scientificName: 'Quercus robur',
    category: 'Tree Foliage',
    icon: '🍃',
    difficulty: 'Easy',
    habitat: 'Deciduous Woods & Parks',
    features: ['Lobed edges', 'Deep green top', 'Pale underside', 'Distinct central vein'],
    defaultRiddle: 'I wear a crown of lobed green upon an ancient noble king. Look beneath the shade of acorns to hear the secret song I sing.',
    samplePayload: 'The physical treasure is hidden under the root of the oldest oak tree near the north entrance!'
  },
  {
    id: 'dandelion',
    name: 'Dandelion',
    scientificName: 'Taraxacum officinale',
    category: 'Wildflower',
    icon: '🌼',
    difficulty: 'Very Easy',
    habitat: 'Lawns, Meadows & Sidewalk Cracks',
    features: ['Golden yellow petals', 'Toothed leaves like lion teeth', 'Hollow stem', 'Fluffy seed sphere'],
    defaultRiddle: 'Born a sun of radiant gold, I turn to snow when I grow old. Make a wish upon my breath to reveal what lies untold.',
    samplePayload: 'Look behind the wooden park bench 5 paces south of the yellow dandelion patch!'
  },
  {
    id: 'pinecone',
    name: 'Pinecone',
    scientificName: 'Pinus sylvestris',
    category: 'Coniferous Seed',
    icon: '🌲',
    difficulty: 'Medium',
    habitat: 'Pine Forests & Evergreen Trails',
    features: ['Woody scales', 'Conical shape', 'Resin scent', 'Spiral Fibonacci pattern'],
    defaultRiddle: 'A wooden armor spun in spirals, protecting seeds through winter trials. Drop me down or pick me up to solve the mystery of these miles.',
    samplePayload: 'The secret passphrase to the trail log is: EVERGREEN_SHADOW_2026'
  },
  {
    id: 'fern',
    name: 'Fern Leaf',
    scientificName: 'Polypodiopsida',
    category: 'Vascular Plant',
    icon: '🌿',
    difficulty: 'Medium',
    habitat: 'Shady Forest Floor & Damp Rocks',
    features: ['Feathery fronds', 'Symmetrical pinnae', 'Coiled fiddleheads', 'Spore dots beneath'],
    defaultRiddle: 'Uncurling like a sleeping snake in damp and shaded woodland glade. Count the fronds of emerald lace where secret memories are made.',
    samplePayload: 'Meet at the stone bridge near the fern ravine when the shadows point east.'
  },
  {
    id: 'moss',
    name: 'Moss Patch',
    scientificName: 'Bryophyta',
    category: 'Non-vascular Plant',
    icon: '🌱',
    difficulty: 'Hard',
    habitat: 'Tree Bark, Damp Stones & Streams',
    features: ['Soft velvet carpet', 'Bright lime to deep emerald', 'Microscopic leaves', 'Spongy texture'],
    defaultRiddle: 'A velvet carpet soft and green, where forest fairies sleep unseen. I face the north on bark and stone, to guide the traveler heading home.',
    samplePayload: 'Look under the mossy stone marked with three notches near the stream crossing.'
  },
  {
    id: 'pine-needle',
    name: 'Pine Needles',
    scientificName: 'Pinus palustris',
    category: 'Foliage Cluster',
    icon: '🎋',
    difficulty: 'Medium',
    habitat: 'Pine Forest Canopy & Ground Cover',
    features: ['Slender evergreen needles', 'Paired bundles', 'Sharp tips', 'Fragrant pine scent'],
    defaultRiddle: 'Needles sharp that never sew, green beneath the winter snow. Listen to the whispering wind among our branches low.',
    samplePayload: 'The trail marker code is HIDDEN_PINENEEDLE_99'
  }
];

export const AI_PROVIDERS = [
  { id: 'gemma-groq', name: 'Google Gemma 2 (Groq API)', openSource: true, description: 'Ultra-fast open-weights model hosted on Groq cloud' },
  { id: 'huggingface-smolvlm', name: 'SmolVLM / Local Edge AI', openSource: true, description: 'Browser-based local vision model (zero latency, offline)' },
  { id: 'devrelay-gemma', name: 'DevRelay Open-AI Proxy', openSource: true, description: 'Open-weight Gemma 2 model via DevRelay API' },
  { id: 'local-embedded', name: 'Local Organic AI Engine', openSource: true, description: 'Built-in procedural botanical generator (always available offline)' }
];
