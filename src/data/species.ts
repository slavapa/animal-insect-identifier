import type { Mode, SpeciesInfo } from '../types';

/**
 * A small offline catalog of species used by the mock recognizer.
 * When a real recognition API (e.g. Google Cloud Vision) is wired in, its
 * returned labels can be matched against this catalog to enrich the result,
 * or replaced entirely by data fetched from a species database/API.
 */
export const SPECIES: SpeciesInfo[] = [
  {
    id: 'red-fox',
    category: 'animal',
    emoji: '🦊',
    commonName: 'Red Fox',
    scientificName: 'Vulpes vulpes',
    summary:
      'The most widespread carnivore in the world, the red fox is a highly adaptable mammal found across the Northern Hemisphere, from wild forests to city suburbs.',
    facts: [
      { label: 'Class', value: 'Mammalia' },
      { label: 'Family', value: 'Canidae' },
      { label: 'Diet', value: 'Omnivore' },
      { label: 'Lifespan', value: '3–6 years (wild)' },
      { label: 'Weight', value: '3–7 kg' },
      { label: 'Habitat', value: 'Forests, grasslands, urban areas' },
    ],
    funFact: 'A red fox can hear a mouse squeak from about 100 metres away.',
    conservationStatus: 'Least Concern',
  },
  {
    id: 'african-elephant',
    category: 'animal',
    emoji: '🐘',
    commonName: 'African Bush Elephant',
    scientificName: 'Loxodonta africana',
    summary:
      'The largest living land animal, the African bush elephant is a keystone species whose foraging shapes entire savanna and forest ecosystems.',
    facts: [
      { label: 'Class', value: 'Mammalia' },
      { label: 'Family', value: 'Elephantidae' },
      { label: 'Diet', value: 'Herbivore' },
      { label: 'Lifespan', value: '60–70 years' },
      { label: 'Weight', value: 'Up to 6,000 kg' },
      { label: 'Habitat', value: 'Savanna, forests, wetlands' },
    ],
    funFact: 'Elephants can recognise themselves in a mirror — a sign of self-awareness.',
    conservationStatus: 'Endangered',
  },
  {
    id: 'bald-eagle',
    category: 'animal',
    emoji: '🦅',
    commonName: 'Bald Eagle',
    scientificName: 'Haliaeetus leucocephalus',
    summary:
      'A powerful bird of prey native to North America, the bald eagle is a sea eagle that hunts primarily for fish near lakes, rivers and coasts.',
    facts: [
      { label: 'Class', value: 'Aves' },
      { label: 'Family', value: 'Accipitridae' },
      { label: 'Diet', value: 'Carnivore (mostly fish)' },
      { label: 'Lifespan', value: '20–30 years' },
      { label: 'Wingspan', value: '1.8–2.3 m' },
      { label: 'Habitat', value: 'Coasts, lakes, rivers' },
    ],
    funFact: 'A bald eagle’s nest can weigh over a tonne and be reused for decades.',
    conservationStatus: 'Least Concern',
  },
  {
    id: 'green-sea-turtle',
    category: 'animal',
    emoji: '🐢',
    commonName: 'Green Sea Turtle',
    scientificName: 'Chelonia mydas',
    summary:
      'A large marine reptile found in tropical and subtropical seas worldwide, named for the greenish colour of its fat rather than its shell.',
    facts: [
      { label: 'Class', value: 'Reptilia' },
      { label: 'Family', value: 'Cheloniidae' },
      { label: 'Diet', value: 'Herbivore (as adult)' },
      { label: 'Lifespan', value: '60–70 years' },
      { label: 'Weight', value: '110–190 kg' },
      { label: 'Habitat', value: 'Tropical & subtropical oceans' },
    ],
    funFact: 'Females often return to the very beach where they hatched to lay their eggs.',
    conservationStatus: 'Endangered',
  },
  {
    id: 'monarch-butterfly',
    category: 'insect',
    emoji: '🦋',
    commonName: 'Monarch Butterfly',
    scientificName: 'Danaus plexippus',
    summary:
      'Famous for its epic multi-generational migration, the monarch travels up to 4,000 km between North America and central Mexico each year.',
    facts: [
      { label: 'Order', value: 'Lepidoptera' },
      { label: 'Family', value: 'Nymphalidae' },
      { label: 'Diet', value: 'Nectar (adult), milkweed (larva)' },
      { label: 'Lifespan', value: '2–6 weeks (most adults)' },
      { label: 'Wingspan', value: '9–10 cm' },
      { label: 'Habitat', value: 'Meadows, fields, gardens' },
    ],
    funFact: 'Monarchs store toxins from milkweed, making them poisonous to predators.',
    conservationStatus: 'Endangered (migratory)',
  },
  {
    id: 'seven-spot-ladybird',
    category: 'insect',
    emoji: '🐞',
    commonName: 'Seven-spot Ladybird',
    scientificName: 'Coccinella septempunctata',
    summary:
      'A familiar red-and-black beetle beloved by gardeners, the seven-spot ladybird is a voracious predator of aphids and other plant pests.',
    facts: [
      { label: 'Order', value: 'Coleoptera' },
      { label: 'Family', value: 'Coccinellidae' },
      { label: 'Diet', value: 'Carnivore (aphids)' },
      { label: 'Lifespan', value: '1–2 years' },
      { label: 'Length', value: '5–8 mm' },
      { label: 'Habitat', value: 'Gardens, grasslands, hedgerows' },
    ],
    funFact: 'A single ladybird can eat as many as 5,000 aphids in its lifetime.',
    conservationStatus: 'Least Concern',
  },
  {
    id: 'western-honey-bee',
    category: 'insect',
    emoji: '🐝',
    commonName: 'Western Honey Bee',
    scientificName: 'Apis mellifera',
    summary:
      'One of the world’s most important pollinators, the western honey bee lives in highly organised colonies and produces honey and beeswax.',
    facts: [
      { label: 'Order', value: 'Hymenoptera' },
      { label: 'Family', value: 'Apidae' },
      { label: 'Diet', value: 'Nectar & pollen' },
      { label: 'Lifespan', value: '6 weeks (worker)' },
      { label: 'Length', value: '10–15 mm' },
      { label: 'Habitat', value: 'Hives near flowering plants' },
    ],
    funFact: 'Bees communicate the direction of food to the hive by performing a “waggle dance”.',
    conservationStatus: 'Not Evaluated',
  },
  {
    id: 'emperor-dragonfly',
    category: 'insect',
    emoji: '🪰',
    commonName: 'Emperor Dragonfly',
    scientificName: 'Anax imperator',
    summary:
      'One of the largest and fastest dragonflies, the emperor is an agile aerial hunter that catches its prey mid-flight over ponds and lakes.',
    facts: [
      { label: 'Order', value: 'Odonata' },
      { label: 'Family', value: 'Aeshnidae' },
      { label: 'Diet', value: 'Carnivore (flying insects)' },
      { label: 'Lifespan', value: '~1 year (mostly as larva)' },
      { label: 'Wingspan', value: '~10 cm' },
      { label: 'Habitat', value: 'Ponds, lakes, slow rivers' },
    ],
    funFact: 'Dragonflies have near-360° vision thanks to eyes with up to 30,000 lenses.',
    conservationStatus: 'Least Concern',
  },
];

export function getSpeciesForMode(mode: Mode): SpeciesInfo[] {
  return SPECIES.filter((s) => s.category === mode);
}
