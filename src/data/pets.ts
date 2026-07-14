export type Pet = {
  id: string;
  name: string;
  type: "Dogs" | "Cats" | "Birds" | "Fish" | "Rabbits" | "Exotic Pets";
  breed: string;
  age: string;
  ageMonths: number;
  gender: "Male" | "Female";
  price: number;
  location: string;
  image: string;
  gallery: string[];
  description: string;
  vaccinated: boolean;
  health: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    phone: string;
  };
  createdAt: string;
};

const img = (id: string) => `https://images.unsplash.com/${id}?w=800&auto=format&fit=crop`;

const sellers = [
  { id: "s1", name: "Happy Paws Kennel", avatar: "https://i.pravatar.cc/120?img=12", rating: 4.9, phone: "+15551234567" },
  { id: "s2", name: "Whisker Haven", avatar: "https://i.pravatar.cc/120?img=32", rating: 4.7, phone: "+15552223344" },
  { id: "s3", name: "Sky Aviaries", avatar: "https://i.pravatar.cc/120?img=45", rating: 4.8, phone: "+15553334455" },
  { id: "s4", name: "Aqua Worlds", avatar: "https://i.pravatar.cc/120?img=15", rating: 4.6, phone: "+15554445566" },
  { id: "s5", name: "Bunny Meadows", avatar: "https://i.pravatar.cc/120?img=27", rating: 4.9, phone: "+15555556677" },
  { id: "s6", name: "Exotic Friends Co", avatar: "https://i.pravatar.cc/120?img=58", rating: 4.8, phone: "+15556667788" },
];

const make = (
  i: number,
  data: Omit<Pet, "id" | "gallery" | "createdAt" | "seller"> & { sellerIdx: number }
): Pet => {
  const { sellerIdx, ...rest } = data;
  return {
    id: `p${i}`,
    ...rest,
    gallery: [rest.image, rest.image, rest.image],
    seller: sellers[sellerIdx],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  };
};

export const pets: Pet[] = [
  make(1, { name: "Buddy", type: "Dogs", breed: "Golden Retriever", age: "3 months", ageMonths: 3, gender: "Male", price: 850, location: "Los Angeles, CA", image: img("photo-1552053831-71594a27632d"), description: "Playful and friendly golden retriever puppy. Loves cuddles and adventures.", vaccinated: true, health: "Excellent", sellerIdx: 0 }),
  make(2, { name: "Luna", type: "Cats", breed: "British Shorthair", age: "6 months", ageMonths: 6, gender: "Female", price: 620, location: "New York, NY", image: img("photo-1574158622682-e40e69881006"), description: "Calm and affectionate kitten with stunning silver coat.", vaccinated: true, health: "Excellent", sellerIdx: 1 }),
  make(3, { name: "Mango", type: "Birds", breed: "Macaw", age: "1 year", ageMonths: 12, gender: "Male", price: 1500, location: "Miami, FL", image: img("photo-1452570053594-1b985d6ea890"), description: "Vibrant macaw, hand-raised and very social.", vaccinated: true, health: "Very Good", sellerIdx: 2 }),
  make(4, { name: "Bubbles", type: "Fish", breed: "Betta Splendens", age: "4 months", ageMonths: 4, gender: "Male", price: 45, location: "Seattle, WA", image: img("photo-1535591273668-578e31182c4f"), description: "Stunning blue betta with flowing fins.", vaccinated: false, health: "Excellent", sellerIdx: 3 }),
  make(5, { name: "Snowball", type: "Rabbits", breed: "Holland Lop", age: "2 months", ageMonths: 2, gender: "Female", price: 180, location: "Austin, TX", image: img("photo-1535241749838-299277b6305f"), description: "Tiny lop-eared bunny, fluffy and litter trained.", vaccinated: true, health: "Excellent", sellerIdx: 4 }),
  make(6, { name: "Ziggy", type: "Exotic Pets", breed: "Bearded Dragon", age: "8 months", ageMonths: 8, gender: "Male", price: 220, location: "Phoenix, AZ", image: img("photo-1591382696684-38c427c7547a"), description: "Friendly bearded dragon, easy to handle.", vaccinated: false, health: "Very Good", sellerIdx: 5 }),
  make(7, { name: "Max", type: "Dogs", breed: "Siberian Husky", age: "5 months", ageMonths: 5, gender: "Male", price: 1100, location: "Denver, CO", image: img("photo-1605568427561-40dd23c2acea"), description: "Energetic husky with striking blue eyes.", vaccinated: true, health: "Excellent", sellerIdx: 0 }),
  make(8, { name: "Mia", type: "Cats", breed: "Maine Coon", age: "4 months", ageMonths: 4, gender: "Female", price: 950, location: "Chicago, IL", image: img("photo-1592194996308-7b43878e84a6"), description: "Majestic maine coon kitten, gentle giant in the making.", vaccinated: true, health: "Excellent", sellerIdx: 1 }),
  make(9, { name: "Kiwi", type: "Birds", breed: "Cockatiel", age: "7 months", ageMonths: 7, gender: "Female", price: 180, location: "Portland, OR", image: img("photo-1591608971362-f08b2a75731a"), description: "Whistling cockatiel that loves to sing.", vaccinated: true, health: "Excellent", sellerIdx: 2 }),
  make(10, { name: "Nemo", type: "Fish", breed: "Clownfish", age: "6 months", ageMonths: 6, gender: "Male", price: 65, location: "San Diego, CA", image: img("photo-1524704654690-b56c05c78a00"), description: "Vibrant clownfish, perfect for reef tanks.", vaccinated: false, health: "Excellent", sellerIdx: 3 }),
  make(11, { name: "Coco", type: "Rabbits", breed: "Mini Rex", age: "3 months", ageMonths: 3, gender: "Male", price: 150, location: "Boston, MA", image: img("photo-1452857297128-d9c29adba80b"), description: "Velvety mini rex bunny, very cuddly.", vaccinated: true, health: "Excellent", sellerIdx: 4 }),
  make(12, { name: "Slither", type: "Exotic Pets", breed: "Ball Python", age: "1 year", ageMonths: 12, gender: "Female", price: 350, location: "Dallas, TX", image: img("photo-1531386151447-fd76ad50012f"), description: "Docile ball python, beginner friendly.", vaccinated: false, health: "Excellent", sellerIdx: 5 }),
  make(13, { name: "Rocky", type: "Dogs", breed: "French Bulldog", age: "4 months", ageMonths: 4, gender: "Male", price: 2200, location: "San Francisco, CA", image: img("photo-1583337130417-3346a1be7dee"), description: "Adorable Frenchie with a goofy personality.", vaccinated: true, health: "Excellent", sellerIdx: 0 }),
  make(14, { name: "Bella", type: "Cats", breed: "Persian", age: "5 months", ageMonths: 5, gender: "Female", price: 780, location: "Atlanta, GA", image: img("photo-1573865526739-10659fec78a5"), description: "Fluffy Persian with sweet temperament.", vaccinated: true, health: "Excellent", sellerIdx: 1 }),
  make(15, { name: "Sunny", type: "Birds", breed: "Parakeet", age: "5 months", ageMonths: 5, gender: "Male", price: 60, location: "Houston, TX", image: img("photo-1591608971362-f08b2a75731a"), description: "Cheerful parakeet, loves company.", vaccinated: true, health: "Excellent", sellerIdx: 2 }),
  make(16, { name: "Goldie", type: "Fish", breed: "Goldfish", age: "8 months", ageMonths: 8, gender: "Female", price: 25, location: "Minneapolis, MN", image: img("photo-1520302630591-fd1c66edc19d"), description: "Classic fancy goldfish, hardy and beautiful.", vaccinated: false, health: "Excellent", sellerIdx: 3 }),
  make(17, { name: "Pepper", type: "Rabbits", breed: "Netherland Dwarf", age: "2 months", ageMonths: 2, gender: "Female", price: 200, location: "Nashville, TN", image: img("photo-1591561582301-7ce6588cc286"), description: "Tiny netherland dwarf, super photogenic.", vaccinated: true, health: "Excellent", sellerIdx: 4 }),
  make(18, { name: "Spike", type: "Exotic Pets", breed: "Hedgehog", age: "6 months", ageMonths: 6, gender: "Male", price: 280, location: "Las Vegas, NV", image: img("photo-1564349683136-77e08dba1ef7"), description: "Quirky hedgehog, hand-tamed and friendly.", vaccinated: false, health: "Excellent", sellerIdx: 5 }),
  make(19, { name: "Charlie", type: "Dogs", breed: "Beagle", age: "6 months", ageMonths: 6, gender: "Male", price: 700, location: "Philadelphia, PA", image: img("photo-1505628346881-b72b27e84530"), description: "Curious beagle, great family companion.", vaccinated: true, health: "Excellent", sellerIdx: 0 }),
  make(20, { name: "Oreo", type: "Cats", breed: "Tuxedo", age: "3 months", ageMonths: 3, gender: "Male", price: 250, location: "Orlando, FL", image: img("photo-1514888286974-6c03e2ca1dba"), description: "Playful tuxedo kitten, ready for a forever home.", vaccinated: true, health: "Excellent", sellerIdx: 1 }),
];

export const categories = [
  { name: "Dogs", icon: "Dog", color: "from-rose-400 to-rose-500" },
  { name: "Cats", icon: "Cat", color: "from-amber-400 to-orange-500" },
  { name: "Birds", icon: "Bird", color: "from-sky-400 to-cyan-500" },
  { name: "Fish", icon: "Fish", color: "from-blue-400 to-indigo-500" },
  { name: "Rabbits", icon: "Rabbit", color: "from-pink-400 to-fuchsia-500" },
  { name: "Exotic Pets", icon: "Turtle", color: "from-emerald-400 to-teal-500" },
] as const;

export const testimonials = [
  { name: "Sarah Johnson", role: "Dog Parent", avatar: "https://i.pravatar.cc/100?img=5", text: "Found our perfect golden retriever through PetWorld. Seamless experience!", rating: 5 },
  { name: "Michael Chen", role: "Cat Enthusiast", avatar: "https://i.pravatar.cc/100?img=8", text: "The verification process gives me real peace of mind. Highly recommend.", rating: 5 },
  { name: "Priya Patel", role: "Rabbit Lover", avatar: "https://i.pravatar.cc/100?img=23", text: "Caring breeders, gentle delivery. Our bunny is thriving!", rating: 5 },
];

export const breeders = sellers.map((s) => ({ ...s, pets: pets.filter((p) => p.seller.id === s.id).length }));

export const blogPosts = [
  { id: "b1", title: "10 Essential Tips for First-Time Dog Owners", category: "Dogs", image: img("photo-1587300003388-59208cc962cb"), excerpt: "Bringing home a new puppy? Here is everything you need to know to get started.", date: "May 10, 2026", readTime: "6 min" },
  { id: "b2", title: "Understanding Your Cat's Behavior", category: "Cats", image: img("photo-1514888286974-6c03e2ca1dba"), excerpt: "Decode the mysterious world of feline body language and meows.", date: "May 5, 2026", readTime: "5 min" },
  { id: "b3", title: "Creating the Perfect Aquarium Setup", category: "Fish", image: img("photo-1520302630591-fd1c66edc19d"), excerpt: "From substrate to lighting, build a thriving underwater world.", date: "Apr 28, 2026", readTime: "8 min" },
  { id: "b4", title: "Bird Nutrition: What to Feed and What to Avoid", category: "Birds", image: img("photo-1591608971362-f08b2a75731a"), excerpt: "Keep your feathered friend healthy with the right diet.", date: "Apr 20, 2026", readTime: "4 min" },
  { id: "b5", title: "Bunny-Proofing Your Home", category: "Rabbits", image: img("photo-1535241749838-299277b6305f"), excerpt: "Simple steps to keep your house and your bunny safe.", date: "Apr 14, 2026", readTime: "5 min" },
  { id: "b6", title: "Caring for Reptiles: A Beginner's Guide", category: "Exotic", image: img("photo-1591382696684-38c427c7547a"), excerpt: "Everything you need to know before bringing home a reptile.", date: "Apr 1, 2026", readTime: "7 min" },
];

export const healthTips = [
  { title: "Daily Exercise Matters", desc: "Most dogs need 30-60 minutes of activity daily." },
  { title: "Hydration is Key", desc: "Always provide fresh, clean water." },
  { title: "Regular Vet Checkups", desc: "Annual visits catch issues early." },
  { title: "Mental Stimulation", desc: "Puzzle toys keep pets sharp and happy." },
];
