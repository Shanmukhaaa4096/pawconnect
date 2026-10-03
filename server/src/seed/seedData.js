import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Pet from '../models/Pet.js';
import Application from '../models/Application.js';
import Favorite from '../models/Favorite.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { memoryStore } from '../store/inMemoryStore.js';

export const initialUsers = [
  {
    _id: '6601a0010000000000000001',
    name: 'Sarah Jenkins',
    email: 'adopter@pawconnect.org',
    password: 'password123',
    role: 'adopter',
    phone: '+1 (555) 234-5678',
    location: { address: '742 Evergreen Terrace', city: 'Austin', state: 'TX', zipCode: '78701' },
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    bio: 'Lifelong animal lover working remotely with a spacious fenced backyard. Ready to provide a forever loving home.',
  },
  {
    _id: '6601a0010000000000000002',
    name: 'Haven Animal Rescue',
    email: 'shelter@pawconnect.org',
    password: 'password123',
    role: 'shelter',
    phone: '+1 (555) 876-5432',
    location: { address: '1200 Rescue Way', city: 'Austin', state: 'TX', zipCode: '78704' },
    avatar: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80',
    organization: {
      name: 'Haven Animal Rescue Foundation',
      licenseNumber: 'TX-SHELTER-49210',
      description: 'Dedicated 501(c)(3) nonprofit rescue saving vulnerable animals and finding compassionate forever families.',
      website: 'https://havenanimalrescue.org',
      verified: true,
    },
    bio: 'Non-profit animal sanctuary serving Central Texas since 2012.',
  },
  {
    _id: '6601a0010000000000000003',
    name: 'Northwest Paws & Whiskers',
    email: 'second_shelter@pawconnect.org',
    password: 'password123',
    role: 'shelter',
    phone: '+1 (555) 432-1098',
    location: { address: '450 Pine Lake Road', city: 'Seattle', state: 'WA', zipCode: '98101' },
    avatar: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80',
    organization: {
      name: 'Northwest Paws & Whiskers Sanctuary',
      licenseNumber: 'WA-NGO-98441',
      description: 'Fostering companionship and protecting homeless cats, dogs, and small animals across Washington.',
      website: 'https://northwestpaws.org',
      verified: true,
    },
    bio: 'Dedicated shelter team committed to no-kill rehabilitation.',
  },
  {
    _id: '6601a0010000000000000004',
    name: 'PawConnect Admin',
    email: 'admin@pawconnect.org',
    password: 'password123',
    role: 'admin',
    phone: '+1 (555) 999-0000',
    location: { address: '100 Innovation Park', city: 'Austin', state: 'TX', zipCode: '78701' },
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Platform safety and community management administrator.',
  },
];

export const initialPets = [
  {
    _id: '6601b0010000000000000001',
    name: 'Milo',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 2,
    ageGroup: 'Young',
    gender: 'Male',
    size: 'Large',
    weightKg: 28,
    health: {
      vaccinated: true,
      spayedNeutered: true,
      specialNeeds: false,
      microchipped: true,
      medicalHistory: 'Full immunizations completed, negative heartworm test, healthy teeth.',
    },
    temperament: ['Friendly', 'Playful', 'Good with Kids', 'Loves Water'],
    goodWith: { children: true, dogs: true, cats: true },
    description: 'Milo is a bundle of golden sunshine! He loves fetch, swimming, and gentle snuggles on the rug. He walks politely on a leash and knows basic commands like Sit, Paw, and Stay.',
    photos: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=1000&q=80',
    ],
    location: { city: 'Austin', state: 'TX', zipCode: '78704' },
    status: 'Available',
    adoptionFee: 75,
    shelter: '6601a0010000000000000002',
    viewsCount: 342,
  },
  {
    _id: '6601b0010000000000000002',
    name: 'Luna',
    species: 'Cat',
    breed: 'Domestic Shorthair',
    age: 1.5,
    ageGroup: 'Young',
    gender: 'Female',
    size: 'Medium',
    weightKg: 4.2,
    health: {
      vaccinated: true,
      spayedNeutered: true,
      specialNeeds: false,
      microchipped: true,
      medicalHistory: 'FIV/FeLV negative, vaccinated, spayed, routine preventative care completed.',
    },
    temperament: ['Calm', 'Affectionate', 'Curious', 'Lap Cat'],
    goodWith: { children: true, dogs: false, cats: true },
    description: 'Luna is an affectionate green-eyed sweetheart who adores curling up on warm laps and purring softly while you read or work. She is litter-box trained and quiet.',
    photos: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1000&q=80',
    ],
    location: { city: 'Austin', state: 'TX', zipCode: '78704' },
    status: 'Available',
    adoptionFee: 50,
    shelter: '6601a0010000000000000002',
    viewsCount: 219,
  },
  {
    _id: '6601b0010000000000000003',
    name: 'Bella',
    species: 'Dog',
    breed: 'Australian Shepherd Mix',
    age: 0.8,
    ageGroup: 'Baby',
    gender: 'Female',
    size: 'Medium',
    weightKg: 14,
    health: {
      vaccinated: true,
      spayedNeutered: true,
      specialNeeds: false,
      microchipped: true,
      medicalHistory: 'Puppy core vaccination series completed, clear fecal and dewormed.',
    },
    temperament: ['Energetic', 'Intelligent', 'Playful', 'Quick Learner'],
    goodWith: { children: true, dogs: true, cats: false },
    description: 'Bella is a bright, vibrant young pup who would excel with an active owner or runner. She thrives on puzzle toys, agility games, and outdoor trail hikes.',
    photos: [
      'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1000&q=80',
    ],
    location: { city: 'Austin', state: 'TX', zipCode: '78704' },
    status: 'Available',
    adoptionFee: 90,
    shelter: '6601a0010000000000000002',
    viewsCount: 412,
  },
  {
    _id: '6601b0010000000000000004',
    name: 'Oliver',
    species: 'Dog',
    breed: 'French Bulldog',
    age: 3,
    ageGroup: 'Adult',
    gender: 'Male',
    size: 'Small',
    weightKg: 11,
    health: {
      vaccinated: true,
      spayedNeutered: true,
      specialNeeds: false,
      microchipped: true,
      medicalHistory: 'Airway evaluated normal for breed, regular joint supplements recommended.',
    },
    temperament: ['Cuddly', 'Charming', 'Gentle', 'Low Energy'],
    goodWith: { children: true, dogs: true, cats: true },
    description: 'Oliver is a polite gentleman who prefers leisurely neighborhood walks followed by afternoon snoozes on plush pillows. Very friendly with other pets!',
    photos: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=80',
    ],
    location: { city: 'Seattle', state: 'WA', zipCode: '98101' },
    status: 'Reserved',
    adoptionFee: 120,
    shelter: '6601a0010000000000000003',
    viewsCount: 520,
  },
  {
    _id: '6601b0010000000000000005',
    name: 'Barnaby',
    species: 'Rabbit',
    breed: 'Holland Lop',
    age: 1.2,
    ageGroup: 'Young',
    gender: 'Male',
    size: 'Small',
    weightKg: 1.8,
    health: {
      vaccinated: true,
      spayedNeutered: true,
      specialNeeds: false,
      microchipped: false,
      medicalHistory: 'Neutered, dental alignment inspected and healthy.',
    },
    temperament: ['Gentle', 'Quiet', 'Curious', 'Loves Greens'],
    goodWith: { children: true, dogs: false, cats: false },
    description: 'Barnaby is a gentle, silky-soft lop-eared rabbit who does adorable binkies when served fresh cilantro and timothy hay. House-trained for indoor free-roam.',
    photos: [
      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=1000&q=80',
    ],
    location: { city: 'Austin', state: 'TX', zipCode: '78704' },
    status: 'Available',
    adoptionFee: 40,
    shelter: '6601a0010000000000000002',
    viewsCount: 165,
  },
  {
    _id: '6601b0010000000000000006',
    name: 'Daisy',
    species: 'Bird',
    breed: 'Cockatiel',
    age: 2,
    ageGroup: 'Young',
    gender: 'Female',
    size: 'Small',
    weightKg: 0.1,
    health: {
      vaccinated: false,
      spayedNeutered: false,
      specialNeeds: false,
      microchipped: false,
      medicalHistory: 'Avian health checkup complete, clear feathers and beak.',
    },
    temperament: ['Vocal', 'Social', 'Musical', 'Affectionate'],
    goodWith: { children: true, dogs: false, cats: false },
    description: 'Daisy whistles happy tunes, mimics simple ringtones, and loves stepping up onto outstretched fingers to receive head scratches.',
    photos: [
      'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=1000&q=80',
    ],
    location: { city: 'Seattle', state: 'WA', zipCode: '98101' },
    status: 'Available',
    adoptionFee: 35,
    shelter: '6601a0010000000000000003',
    viewsCount: 128,
  },
  {
    _id: '6601b0010000000000000007',
    name: 'Rocky',
    species: 'Dog',
    breed: 'German Shepherd',
    age: 4,
    ageGroup: 'Adult',
    gender: 'Male',
    size: 'Large',
    weightKg: 34,
    health: {
      vaccinated: true,
      spayedNeutered: true,
      specialNeeds: false,
      microchipped: true,
      medicalHistory: 'Joint X-rays clear, excellent conditioning and stamina.',
    },
    temperament: ['Loyal', 'Protective', 'Attentive', 'Devoted'],
    goodWith: { children: true, dogs: true, cats: false },
    description: 'Rocky is a remarkably loyal companion. Extremely obedient, housebroken, and eager to please. He would make an incredible watchdog and trail partner.',
    photos: [
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=1000&q=80',
    ],
    location: { city: 'Austin', state: 'TX', zipCode: '78704' },
    status: 'Available',
    adoptionFee: 85,
    shelter: '6601a0010000000000000002',
    viewsCount: 389,
  },
  {
    _id: '6601b0010000000000000008',
    name: 'Simba',
    species: 'Cat',
    breed: 'Maine Coon',
    age: 5,
    ageGroup: 'Adult',
    gender: 'Male',
    size: 'Large',
    weightKg: 7.5,
    health: {
      vaccinated: true,
      spayedNeutered: true,
      specialNeeds: false,
      microchipped: true,
      medicalHistory: 'Regularly groomed, healthy heart and kidneys.',
    },
    temperament: ['Majestic', 'Gentle Giant', 'Affectionate', 'Calm'],
    goodWith: { children: true, dogs: true, cats: true },
    description: 'Simba has found his wonderful forever family! A majestic lion-like fluffball who enriched everyone around him.',
    photos: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1000&q=80',
    ],
    location: { city: 'Austin', state: 'TX', zipCode: '78704' },
    status: 'Adopted',
    adoptionFee: 95,
    shelter: '6601a0010000000000000002',
    viewsCount: 640,
  },
  {
    _id: '6601b0010000000000000009',
    name: 'Coco',
    species: 'Dog',
    breed: 'Toy Poodle',
    age: 1.1,
    ageGroup: 'Young',
    gender: 'Female',
    size: 'Small',
    weightKg: 4.1,
    health: {
      vaccinated: true,
      spayedNeutered: true,
      specialNeeds: false,
      microchipped: true,
      medicalHistory: 'Hypoallergenic non-shedding coat, fully vaccinated.',
    },
    temperament: ['Smart', 'Hypoallergenic', 'Playful', 'Cuddle Bug'],
    goodWith: { children: true, dogs: true, cats: true },
    description: 'Coco is tiny, hypoallergenic, and smarter than an honors student! She knows dozens of agility tricks and loves sitting on laps during Zoom meetings.',
    photos: [
      'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546975490-a79abdd54533?auto=format&fit=crop&w=1000&q=80',
    ],
    location: { city: 'Seattle', state: 'WA', zipCode: '98101' },
    status: 'Available',
    adoptionFee: 110,
    shelter: '6601a0010000000000000003',
    viewsCount: 477,
  },
  {
    _id: '6601b0010000000000000010',
    name: 'Zeus',
    species: 'Dog',
    breed: 'Siberian Husky',
    age: 3,
    ageGroup: 'Adult',
    gender: 'Male',
    size: 'Large',
    weightKg: 26,
    health: {
      vaccinated: true,
      spayedNeutered: true,
      specialNeeds: false,
      microchipped: true,
      medicalHistory: 'Eye checks clear, joints verified healthy, active runner.',
    },
    temperament: ['Adventurous', 'Vocal', 'Energetic', 'Pack Oriented'],
    goodWith: { children: true, dogs: true, cats: false },
    description: 'Zeus has captivating icy-blue eyes and a charming talkative personality. He is in search of an adventurous partner who loves hiking in nature.',
    photos: [
      'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1563889362352-b0492c224f61?auto=format&fit=crop&w=1000&q=80',
    ],
    location: { city: 'Austin', state: 'TX', zipCode: '78704' },
    status: 'Available',
    adoptionFee: 80,
    shelter: '6601a0010000000000000002',
    viewsCount: 395,
  },
];

export const initialApplications = [
  {
    _id: '6601c0010000000000000001',
    pet: '6601b0010000000000000001', // Milo
    adopter: '6601a0010000000000000001', // Sarah Jenkins
    shelter: '6601a0010000000000000002', // Haven Animal Rescue
    status: 'Pending',
    questionnaire: {
      fullName: 'Sarah Jenkins',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Austin, TX',
      housingType: 'House with Yard',
      ownership: 'Own',
      hasOtherPets: false,
      otherPetsDetails: 'None currently; had a beloved Golden Retriever for 12 years previously.',
      hasChildren: false,
      childrenAges: '',
      hoursAlonePerDay: 2,
      petExperience: 'Experienced Caretaker',
      reasonForAdopting: 'I work remotely with a high-fenced yard and miss having a loyal dog to hike and play with every single day.',
    },
    shelterNotes: 'Application received. Home check scheduled for next Tuesday.',
    timeline: [
      { status: 'Pending', date: new Date(Date.now() - 3600 * 1000 * 24 * 2), note: 'Application submitted by Sarah Jenkins.' },
    ],
  },
  {
    _id: '6601c0010000000000000002',
    pet: '6601b0010000000000000004', // Oliver
    adopter: '6601a0010000000000000001', // Sarah Jenkins
    shelter: '6601a0010000000000000003', // NW Paws
    status: 'Approved',
    questionnaire: {
      fullName: 'Sarah Jenkins',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Austin, TX',
      housingType: 'House with Yard',
      ownership: 'Own',
      hasOtherPets: false,
      otherPetsDetails: '',
      hasChildren: false,
      childrenAges: '',
      hoursAlonePerDay: 3,
      petExperience: 'Experienced Caretaker',
      reasonForAdopting: 'Oliver has the sweetest personality and would receive endless love and gentle care.',
    },
    shelterNotes: 'Adopter passed vet reference check with flying colors. Awaiting meet and greet.',
    timeline: [
      { status: 'Pending', date: new Date(Date.now() - 3600 * 1000 * 24 * 5), note: 'Application submitted.' },
      { status: 'Approved', date: new Date(Date.now() - 3600 * 1000 * 24 * 1), note: 'Vet check verified; approved by Shelter coordinator.' },
    ],
  },
];

export const initialFavorites = [
  {
    _id: '6601d0010000000000000001',
    user: '6601a0010000000000000001', // Sarah
    pet: '6601b0010000000000000001', // Milo
  },
  {
    _id: '6601d0010000000000000002',
    user: '6601a0010000000000000001', // Sarah
    pet: '6601b0010000000000000002', // Luna
  },
];

export const initialConversations = [
  {
    _id: '6601e0010000000000000001',
    participants: ['6601a0010000000000000001', '6601a0010000000000000002'], // Sarah & Haven Animal Rescue
    pet: '6601b0010000000000000001', // Milo
    lastMessage: "Hi Sarah! We reviewed your application for Milo and would love to arrange a visit.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30),
  },
];

export const initialMessages = [
  {
    _id: '6601f0010000000000000001',
    conversationId: '6601e0010000000000000001',
    sender: '6601a0010000000000000001', // Sarah
    receiver: '6601a0010000000000000002', // Haven
    pet: '6601b0010000000000000001',
    text: "Hello! I just submitted an adoption application for Milo. Is he okay with car rides?",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    _id: '6601f0010000000000000002',
    conversationId: '6601e0010000000000000001',
    sender: '6601a0010000000000000002', // Haven
    receiver: '6601a0010000000000000001', // Sarah
    pet: '6601b0010000000000000001',
    text: "Hi Sarah! Yes, Milo loves car rides! We reviewed your application for Milo and would love to arrange a visit.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
];

export const seedInitialData = async (isInMemoryOnly = false) => {
  // Populate inMemoryStore with hashed passwords for bcrypt.compare
  const hashedUsers = await Promise.all(
    initialUsers.map(async (u) => {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      return { ...u, password: hashedPassword };
    })
  );
  memoryStore.users = hashedUsers;
  memoryStore.pets = JSON.parse(JSON.stringify(initialPets));
  memoryStore.applications = JSON.parse(JSON.stringify(initialApplications));
  memoryStore.favorites = JSON.parse(JSON.stringify(initialFavorites));
  memoryStore.conversations = JSON.parse(JSON.stringify(initialConversations));
  memoryStore.messages = JSON.parse(JSON.stringify(initialMessages));

  console.log(`🐾 [PawConnect Store] Initialized with ${memoryStore.pets.length} pets, ${memoryStore.users.length} users, and ${memoryStore.applications.length} applications.`);

  if (isInMemoryOnly) return;

  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 [MongoDB] Seeding database with initial data...');
      for (const u of initialUsers) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await User.create({ ...u, password: hashedPassword });
      }
      await Pet.insertMany(initialPets);
      await Application.insertMany(initialApplications);
      await Favorite.insertMany(initialFavorites);
      await Conversation.insertMany(initialConversations);
      await Message.insertMany(initialMessages);
      console.log('✅ [MongoDB] Seeding completed successfully!');
    } else {
      console.log(`ℹ️ [MongoDB] Database already contains ${userCount} users.`);
    }
  } catch (err) {
    console.warn(`⚠️ [MongoDB] Seed error: ${err.message}`);
  }
};
