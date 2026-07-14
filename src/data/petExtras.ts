import { pets, type Pet } from "./pets";

// Deterministic pseudo-random based on pet id
const seed = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
};
const pick = <T,>(id: string, salt: number, arr: T[]) => arr[(seed(id) + salt) % arr.length];

export type PetTraits = {
  temperament: "Calm" | "Playful" | "Energetic" | "Affectionate" | "Independent";
  energy: 1 | 2 | 3 | 4 | 5;
  kidsFriendly: boolean;
  petFriendly: boolean;
  hypoallergenic: boolean;
  trainability: 1 | 2 | 3 | 4 | 5;
};

export type Verification = {
  verified: boolean;
  microchipped: boolean;
  certificateId: string;
  vetName: string;
  issuedOn: string;
  background: "Verified" | "Pending";
};

export type TimelineEvent = { date: string; title: string; desc: string };

export type Review = {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
};

const temperaments: PetTraits["temperament"][] = ["Calm", "Playful", "Energetic", "Affectionate", "Independent"];

// Rough city coordinates for map view
const cityCoords: Record<string, [number, number]> = {
  "Los Angeles, CA": [34.05, -118.24],
  "New York, NY": [40.71, -74.01],
  "Miami, FL": [25.76, -80.19],
  "Seattle, WA": [47.6, -122.33],
  "Austin, TX": [30.27, -97.74],
  "Phoenix, AZ": [33.45, -112.07],
  "Denver, CO": [39.74, -104.99],
  "Chicago, IL": [41.88, -87.63],
  "Portland, OR": [45.52, -122.68],
  "San Diego, CA": [32.72, -117.16],
  "Boston, MA": [42.36, -71.06],
  "Dallas, TX": [32.78, -96.8],
  "San Francisco, CA": [37.77, -122.42],
  "Atlanta, GA": [33.75, -84.39],
  "Houston, TX": [29.76, -95.37],
  "Minneapolis, MN": [44.98, -93.27],
  "Nashville, TN": [36.16, -86.78],
  "Las Vegas, NV": [36.17, -115.14],
  "Philadelphia, PA": [39.95, -75.17],
  "Orlando, FL": [28.54, -81.38],
};

export const getTraits = (pet: Pet): PetTraits => {
  const s = seed(pet.id);
  return {
    temperament: pick(pet.id, 1, temperaments),
    energy: (((s >> 2) % 5) + 1) as PetTraits["energy"],
    kidsFriendly: pet.type !== "Exotic Pets" && s % 4 !== 0,
    petFriendly: s % 3 !== 0,
    hypoallergenic: ["Poodle", "Maltese", "Bichon"].some((b) => pet.breed.includes(b)) || s % 7 === 0,
    trainability: (((s >> 4) % 5) + 1) as PetTraits["trainability"],
  };
};

export const getVerification = (pet: Pet): Verification => {
  const s = seed(pet.id);
  const issued = new Date(Date.now() - (s % 90) * 86400000);
  return {
    verified: s % 5 !== 0,
    microchipped: s % 3 !== 0,
    certificateId: `PW-${pet.id.toUpperCase()}-${(s % 9000) + 1000}`,
    vetName: pick(pet.id, 3, ["Dr. Emily Stone", "Dr. Raj Patel", "Dr. Maria Lopez", "Dr. John Wright"]),
    issuedOn: issued.toISOString().slice(0, 10),
    background: s % 5 !== 0 ? "Verified" : "Pending",
  };
};

export const getTimeline = (pet: Pet): TimelineEvent[] => {
  const base = new Date(pet.createdAt).getTime();
  const d = (days: number) => new Date(base - days * 86400000).toISOString().slice(0, 10);
  return [
    { date: d(0), title: "Listed on PetWorld", desc: `${pet.name} became available for adoption.` },
    { date: d(20), title: "Vet checkup", desc: `Full health screening passed by ${getVerification(pet).vetName}.` },
    { date: d(40), title: "Vaccinations completed", desc: "Age-appropriate vaccinations administered." },
    { date: d(60), title: "Microchipped", desc: "Unique microchip registered to seller." },
    { date: d(pet.ageMonths * 30), title: "Born", desc: `${pet.name} was born at a licensed facility.` },
  ];
};

const reviewers = [
  { user: "Alex M.", avatar: "https://i.pravatar.cc/80?img=11" },
  { user: "Jamie R.", avatar: "https://i.pravatar.cc/80?img=22" },
  { user: "Priya K.", avatar: "https://i.pravatar.cc/80?img=33" },
  { user: "Diego L.", avatar: "https://i.pravatar.cc/80?img=44" },
];
const reviewTexts = [
  "Smooth process, the seller was super helpful and our new family member is healthy and happy.",
  "Vet records were detailed and accurate. Would highly recommend.",
  "Great communication throughout. The pet's temperament was exactly as described.",
  "A truly transparent experience — verification badges gave us peace of mind.",
];

export const getReviews = (pet: Pet): Review[] => {
  const s = seed(pet.id);
  return reviewers.slice(0, 3 + (s % 2)).map((r, i) => ({
    id: `${pet.id}-r${i}`,
    user: r.user,
    avatar: r.avatar,
    rating: 4 + ((s + i) % 2),
    date: new Date(Date.now() - (i + 1) * 7 * 86400000).toISOString().slice(0, 10),
    text: reviewTexts[(s + i) % reviewTexts.length],
  }));
};

export const getCoords = (pet: Pet): [number, number] =>
  cityCoords[pet.location] || [39.5, -98.35];

// Community data
export const communityProfiles = [
  {
    id: "u1",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/120?img=5",
    location: "Los Angeles, CA",
    bio: "Golden retriever mom · Trail runner · Foster home for senior dogs.",
    pets: ["Buddy", "Charlie"],
    photos: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&auto=format&fit=crop",
    ],
    followers: 1240,
  },
  {
    id: "u2",
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/120?img=8",
    location: "New York, NY",
    bio: "Cat enthusiast · Volunteer at city shelter · Sharing daily Maine Coon photos.",
    pets: ["Mia", "Luna"],
    photos: [
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop",
    ],
    followers: 980,
  },
  {
    id: "u3",
    name: "Priya Patel",
    avatar: "https://i.pravatar.cc/120?img=23",
    location: "Austin, TX",
    bio: "Rabbit rescue · Promoting humane care and adoption awareness.",
    pets: ["Snowball", "Coco"],
    photos: [
      "https://images.unsplash.com/photo-1535241749838-299277b6305f?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591561582301-7ce6588cc286?w=600&auto=format&fit=crop",
    ],
    followers: 612,
  },
];

export const communityTips = [
  {
    id: "t1",
    author: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/80?img=5",
    title: "Make crate training a game",
    body: "Toss treats inside and let the puppy choose to enter. Never force. Within a week ours loved her crate.",
    likes: 142,
    category: "Training",
  },
  {
    id: "t2",
    author: "Michael Chen",
    avatar: "https://i.pravatar.cc/80?img=8",
    title: "Window perch = happy cat",
    body: "A simple suction-cup perch gave our Maine Coon hours of entertainment. Best $20 ever spent.",
    likes: 98,
    category: "Enrichment",
  },
  {
    id: "t3",
    author: "Priya Patel",
    avatar: "https://i.pravatar.cc/80?img=23",
    title: "Rabbit-proof in 10 minutes",
    body: "Cable wraps on every wire at floor level. Saves your bunny and your headphones.",
    likes: 76,
    category: "Safety",
  },
];

export const meetups = [
  { id: "m1", title: "Sunday Puppy Social", location: "Griffith Park, LA", date: "Jun 21, 2026", attendees: 42, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop" },
  { id: "m2", title: "Cat Cafe Mixer", location: "Brooklyn, NY", date: "Jun 28, 2026", attendees: 18, image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop" },
  { id: "m3", title: "Bunny Hop Picnic", location: "Zilker Park, Austin", date: "Jul 5, 2026", attendees: 24, image: "https://images.unsplash.com/photo-1535241749838-299277b6305f?w=600&auto=format&fit=crop" },
];

export const matchQuestions = [
  {
    id: "space",
    question: "How much space do you have at home?",
    options: [
      { label: "Small apartment", value: "small" },
      { label: "Medium home", value: "medium" },
      { label: "Large house with yard", value: "large" },
    ],
  },
  {
    id: "activity",
    question: "How active is your lifestyle?",
    options: [
      { label: "Low — chill at home", value: "low" },
      { label: "Moderate — daily walks", value: "med" },
      { label: "High — runs and adventures", value: "high" },
    ],
  },
  {
    id: "experience",
    question: "Your pet experience level?",
    options: [
      { label: "First-time owner", value: "new" },
      { label: "Some experience", value: "some" },
      { label: "Seasoned", value: "pro" },
    ],
  },
  {
    id: "kids",
    question: "Do you have young children?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: "allergy",
    question: "Any allergy concerns?",
    options: [
      { label: "Yes — need hypoallergenic", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
] as const;

export type MatchAnswers = Record<string, string>;

export const scorePet = (pet: Pet, answers: MatchAnswers): number => {
  const t = getTraits(pet);
  let score = 50;
  // Space
  if (answers.space === "small" && ["Fish", "Birds", "Cats", "Rabbits"].includes(pet.type)) score += 20;
  if (answers.space === "large" && pet.type === "Dogs") score += 20;
  // Activity
  if (answers.activity === "high" && t.energy >= 4) score += 15;
  if (answers.activity === "low" && t.energy <= 2) score += 15;
  if (answers.activity === "med" && t.energy === 3) score += 10;
  // Experience
  if (answers.experience === "new" && t.trainability >= 4) score += 10;
  if (answers.experience === "pro") score += 5;
  // Kids
  if (answers.kids === "yes" && t.kidsFriendly) score += 10;
  if (answers.kids === "yes" && !t.kidsFriendly) score -= 15;
  // Allergy
  if (answers.allergy === "yes" && t.hypoallergenic) score += 15;
  if (answers.allergy === "yes" && !t.hypoallergenic) score -= 20;
  return Math.max(0, Math.min(100, score));
};

export const matchPets = (answers: MatchAnswers) =>
  [...pets]
    .map((p) => ({ pet: p, score: scorePet(p, answers) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
