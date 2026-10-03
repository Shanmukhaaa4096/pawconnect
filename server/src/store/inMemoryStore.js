import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const memoryStore = {
  users: [],
  pets: [],
  applications: [],
  favorites: [],
  conversations: [],
  messages: [],
};

const generateId = () => new mongoose.Types.ObjectId().toString();

export const repository = {
  // USER METHODS
  async findUserByEmail(email) {
    if (mongoose.connection.readyState === 1) {
      return mongoose.model('User').findOne({ email: email.toLowerCase() });
    }
    return memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (mongoose.connection.readyState === 1) {
      return mongoose.model('User').findById(id).select('-password');
    }
    const user = memoryStore.users.find((u) => u._id.toString() === id.toString());
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async createUser(userData) {
    if (mongoose.connection.readyState === 1) {
      return mongoose.model('User').create(userData);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = {
      _id: generateId(),
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.users.push(newUser);
    const { password, ...safeUser } = newUser;
    return safeUser;
  },

  async updateUser(id, updateData) {
    if (mongoose.connection.readyState === 1) {
      return mongoose.model('User').findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    }
    const index = memoryStore.users.findIndex((u) => u._id.toString() === id.toString());
    if (index === -1) return null;
    memoryStore.users[index] = {
      ...memoryStore.users[index],
      ...updateData,
      updatedAt: new Date(),
    };
    const { password, ...safeUser } = memoryStore.users[index];
    return safeUser;
  },

  async findShelters() {
    if (mongoose.connection.readyState === 1) {
      return mongoose.model('User').find({ role: 'shelter' }).select('-password');
    }
    return memoryStore.users
      .filter((u) => u.role === 'shelter')
      .map(({ password, ...u }) => u);
  },

  // PET METHODS
  async findPets({ species, breed, ageGroup, status, location, gender, size, search, shelterId }) {
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (species && species !== 'All') query.species = species;
      if (breed) query.breed = new RegExp(breed, 'i');
      if (ageGroup && ageGroup !== 'All') query.ageGroup = ageGroup;
      if (status && status !== 'All') query.status = status;
      if (gender && gender !== 'All') query.gender = gender;
      if (size && size !== 'All') query.size = size;
      if (shelterId) query.shelter = shelterId;
      if (location) {
        query.$or = [
          { 'location.city': new RegExp(location, 'i') },
          { 'location.state': new RegExp(location, 'i') },
        ];
      }
      if (search) {
        const regex = new RegExp(search, 'i');
        query.$or = [
          { name: regex },
          { breed: regex },
          { description: regex },
          { 'location.city': regex },
        ];
      }
      return mongoose.model('Pet').find(query).populate('shelter', 'name email phone avatar organization location').sort({ createdAt: -1 });
    }

    // In-memory filter
    return memoryStore.pets
      .filter((pet) => {
        if (species && species !== 'All' && pet.species.toLowerCase() !== species.toLowerCase()) return false;
        if (breed && !pet.breed.toLowerCase().includes(breed.toLowerCase())) return false;
        if (ageGroup && ageGroup !== 'All' && pet.ageGroup !== ageGroup) return false;
        if (status && status !== 'All' && pet.status !== status) return false;
        if (gender && gender !== 'All' && pet.gender !== gender) return false;
        if (size && size !== 'All' && pet.size !== size) return false;
        if (shelterId && pet.shelter?.toString() !== shelterId.toString()) return false;
        if (location) {
          const locStr = `${pet.location?.city || ''} ${pet.location?.state || ''}`.toLowerCase();
          if (!locStr.includes(location.toLowerCase())) return false;
        }
        if (search) {
          const s = search.toLowerCase();
          const matches =
            pet.name.toLowerCase().includes(s) ||
            pet.breed.toLowerCase().includes(s) ||
            pet.description.toLowerCase().includes(s) ||
            (pet.location?.city && pet.location.city.toLowerCase().includes(s));
          if (!matches) return false;
        }
        return true;
      })
      .map((pet) => {
        const shelterObj = memoryStore.users.find((u) => u._id.toString() === pet.shelter?.toString());
        return {
          ...pet,
          shelter: shelterObj
            ? {
                _id: shelterObj._id,
                name: shelterObj.name,
                email: shelterObj.email,
                phone: shelterObj.phone,
                avatar: shelterObj.avatar,
                organization: shelterObj.organization,
                location: shelterObj.location,
              }
            : pet.shelter,
        };
      })
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  },

  async findPetById(id) {
    if (mongoose.connection.readyState === 1) {
      return mongoose.model('Pet').findById(id).populate('shelter', 'name email phone avatar organization location bio');
    }
    const pet = memoryStore.pets.find((p) => p._id.toString() === id.toString());
    if (!pet) return null;
    const shelterObj = memoryStore.users.find((u) => u._id.toString() === pet.shelter?.toString());
    return {
      ...pet,
      shelter: shelterObj
        ? {
            _id: shelterObj._id,
            name: shelterObj.name,
            email: shelterObj.email,
            phone: shelterObj.phone,
            avatar: shelterObj.avatar,
            organization: shelterObj.organization,
            location: shelterObj.location,
            bio: shelterObj.bio,
          }
        : pet.shelter,
    };
  },

  async createPet(petData) {
    if (mongoose.connection.readyState === 1) {
      const pet = await mongoose.model('Pet').create(petData);
      return pet.populate('shelter', 'name email phone avatar organization location');
    }
    const newPet = {
      _id: generateId(),
      ...petData,
      viewsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.pets.unshift(newPet);
    return this.findPetById(newPet._id);
  },

  async updatePet(id, updateData) {
    if (mongoose.connection.readyState === 1) {
      return mongoose.model('Pet').findByIdAndUpdate(id, updateData, { new: true }).populate('shelter', 'name email phone avatar organization location');
    }
    const index = memoryStore.pets.findIndex((p) => p._id.toString() === id.toString());
    if (index === -1) return null;
    memoryStore.pets[index] = {
      ...memoryStore.pets[index],
      ...updateData,
      updatedAt: new Date(),
    };
    return this.findPetById(id);
  },

  async deletePet(id) {
    if (mongoose.connection.readyState === 1) {
      return mongoose.model('Pet').findByIdAndDelete(id);
    }
    const index = memoryStore.pets.findIndex((p) => p._id.toString() === id.toString());
    if (index === -1) return null;
    const deleted = memoryStore.pets.splice(index, 1);
    return deleted[0];
  },

  // FAVORITES METHODS
  async getFavoritesByUser(userId) {
    if (mongoose.connection.readyState === 1) {
      const favs = await mongoose.model('Favorite').find({ user: userId }).populate({
        path: 'pet',
        populate: { path: 'shelter', select: 'name organization location avatar' },
      });
      return favs.map((f) => f.pet).filter(Boolean);
    }
    const favPetIds = memoryStore.favorites
      .filter((f) => f.user.toString() === userId.toString())
      .map((f) => f.pet.toString());

    return Promise.all(favPetIds.map((id) => this.findPetById(id))).then((pets) => pets.filter(Boolean));
  },

  async toggleFavorite(userId, petId) {
    if (mongoose.connection.readyState === 1) {
      const existing = await mongoose.model('Favorite').findOne({ user: userId, pet: petId });
      if (existing) {
        await mongoose.model('Favorite').findByIdAndDelete(existing._id);
        return { isFavorite: false };
      }
      await mongoose.model('Favorite').create({ user: userId, pet: petId });
      return { isFavorite: true };
    }
    const index = memoryStore.favorites.findIndex(
      (f) => f.user.toString() === userId.toString() && f.pet.toString() === petId.toString()
    );
    if (index !== -1) {
      memoryStore.favorites.splice(index, 1);
      return { isFavorite: false };
    }
    memoryStore.favorites.push({
      _id: generateId(),
      user: userId,
      pet: petId,
      createdAt: new Date(),
    });
    return { isFavorite: true };
  },

  async checkIsFavorite(userId, petId) {
    if (!userId) return false;
    if (mongoose.connection.readyState === 1) {
      const count = await mongoose.model('Favorite').countDocuments({ user: userId, pet: petId });
      return count > 0;
    }
    return memoryStore.favorites.some(
      (f) => f.user.toString() === userId.toString() && f.pet.toString() === petId.toString()
    );
  },

  // APPLICATIONS METHODS
  async createApplication(appData) {
    if (mongoose.connection.readyState === 1) {
      const app = await mongoose.model('Application').create(appData);
      return app.populate([
        { path: 'pet', populate: { path: 'shelter' } },
        { path: 'adopter', select: 'name email phone avatar' },
        { path: 'shelter', select: 'name email organization phone' },
      ]);
    }
    const newApp = {
      _id: generateId(),
      ...appData,
      timeline: [
        {
          status: 'Pending',
          date: new Date(),
          note: 'Application submitted by adopter.',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.applications.unshift(newApp);
    return this.findApplicationById(newApp._id);
  },

  async findApplicationById(id) {
    if (mongoose.connection.readyState === 1) {
      return mongoose.model('Application').findById(id).populate([
        { path: 'pet' },
        { path: 'adopter', select: 'name email phone avatar location' },
        { path: 'shelter', select: 'name email organization phone avatar' },
      ]);
    }
    const app = memoryStore.applications.find((a) => a._id.toString() === id.toString());
    if (!app) return null;
    const pet = await this.findPetById(app.pet);
    const adopter = await this.findUserById(app.adopter);
    const shelter = await this.findUserById(app.shelter);
    return {
      ...app,
      pet,
      adopter,
      shelter,
    };
  },

  async findApplicationsByAdopter(adopterId) {
    if (mongoose.connection.readyState === 1) {
      return mongoose.model('Application').find({ adopter: adopterId }).populate([
        { path: 'pet' },
        { path: 'shelter', select: 'name email organization phone avatar location' },
      ]).sort({ createdAt: -1 });
    }
    const apps = memoryStore.applications.filter((a) => a.adopter.toString() === adopterId.toString());
    return Promise.all(apps.map((a) => this.findApplicationById(a._id)));
  },

  async findApplicationsByShelter(shelterId) {
    if (mongoose.connection.readyState === 1) {
      return mongoose.model('Application').find({ shelter: shelterId }).populate([
        { path: 'pet' },
        { path: 'adopter', select: 'name email phone avatar location' },
      ]).sort({ createdAt: -1 });
    }
    const apps = memoryStore.applications.filter((a) => a.shelter.toString() === shelterId.toString());
    return Promise.all(apps.map((a) => this.findApplicationById(a._id)));
  },

  async updateApplicationStatus(id, { status, shelterNotes }) {
    if (mongoose.connection.readyState === 1) {
      const app = await mongoose.model('Application').findById(id);
      if (!app) return null;
      app.status = status;
      if (shelterNotes) app.shelterNotes = shelterNotes;
      app.timeline.push({
        status,
        date: new Date(),
        note: shelterNotes || `Status updated to ${status}`,
      });
      await app.save();

      // If approved or completed, update pet status accordingly
      if (status === 'Approved') {
        await mongoose.model('Pet').findByIdAndUpdate(app.pet, { status: 'Reserved' });
      } else if (status === 'Completed') {
        await mongoose.model('Pet').findByIdAndUpdate(app.pet, { status: 'Adopted' });
      }
      return this.findApplicationById(id);
    }

    const index = memoryStore.applications.findIndex((a) => a._id.toString() === id.toString());
    if (index === -1) return null;
    const app = memoryStore.applications[index];
    app.status = status;
    if (shelterNotes) app.shelterNotes = shelterNotes;
    app.timeline.push({
      status,
      date: new Date(),
      note: shelterNotes || `Status updated to ${status}`,
    });
    app.updatedAt = new Date();

    if (status === 'Approved') {
      await this.updatePet(app.pet, { status: 'Reserved' });
    } else if (status === 'Completed') {
      await this.updatePet(app.pet, { status: 'Adopted' });
    }
    return this.findApplicationById(id);
  },

  // CONVERSATIONS & MESSAGES
  async findOrCreateConversation(userId1, userId2, petId = null) {
    if (mongoose.connection.readyState === 1) {
      let conv = await mongoose.model('Conversation').findOne({
        participants: { $all: [userId1, userId2] },
      }).populate('participants', 'name email avatar organization role').populate('pet');

      if (!conv) {
        conv = await mongoose.model('Conversation').create({
          participants: [userId1, userId2],
          pet: petId,
          lastMessage: '',
        });
        conv = await conv.populate('participants', 'name email avatar organization role');
      }
      return conv;
    }

    let conv = memoryStore.conversations.find(
      (c) =>
        c.participants.map((p) => p.toString()).includes(userId1.toString()) &&
        c.participants.map((p) => p.toString()).includes(userId2.toString())
    );

    if (!conv) {
      conv = {
        _id: generateId(),
        participants: [userId1, userId2],
        pet: petId,
        lastMessage: '',
        lastMessageAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.conversations.push(conv);
    }

    const p1 = await this.findUserById(userId1);
    const p2 = await this.findUserById(userId2);
    const petObj = petId ? await this.findPetById(petId) : null;
    return {
      ...conv,
      participants: [p1, p2].filter(Boolean),
      pet: petObj,
    };
  },

  async getUserConversations(userId) {
    if (mongoose.connection.readyState === 1) {
      return mongoose.model('Conversation').find({
        participants: userId,
      })
        .populate('participants', 'name email avatar organization role')
        .populate('pet', 'name species photos status')
        .sort({ lastMessageAt: -1 });
    }

    const convs = memoryStore.conversations.filter((c) =>
      c.participants.map((p) => p.toString()).includes(userId.toString())
    );

    return Promise.all(
      convs.map(async (c) => {
        const participants = await Promise.all(c.participants.map((pId) => this.findUserById(pId)));
        const pet = c.pet ? await this.findPetById(c.pet) : null;
        return {
          ...c,
          participants,
          pet,
        };
      })
    ).then((res) => res.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0)));
  },

  async getMessagesByConversation(convId) {
    if (mongoose.connection.readyState === 1) {
      return mongoose.model('Message').find({ conversationId: convId })
        .populate('sender', 'name avatar role')
        .sort({ createdAt: 1 });
    }
    const msgs = memoryStore.messages.filter((m) => m.conversationId.toString() === convId.toString());
    return Promise.all(
      msgs.map(async (m) => {
        const sender = await this.findUserById(m.sender);
        return {
          ...m,
          sender,
        };
      })
    ).then((res) => res.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
  },

  async createMessage({ conversationId, senderId, receiverId, petId, text }) {
    if (mongoose.connection.readyState === 1) {
      const msg = await mongoose.model('Message').create({
        conversationId,
        sender: senderId,
        receiver: receiverId,
        pet: petId,
        text,
      });
      await mongoose.model('Conversation').findByIdAndUpdate(conversationId, {
        lastMessage: text,
        lastMessageAt: new Date(),
      });
      return msg.populate('sender', 'name avatar role');
    }

    const newMsg = {
      _id: generateId(),
      conversationId,
      sender: senderId,
      receiver: receiverId,
      pet: petId,
      text,
      read: false,
      createdAt: new Date(),
    };
    memoryStore.messages.push(newMsg);

    const conv = memoryStore.conversations.find((c) => c._id.toString() === conversationId.toString());
    if (conv) {
      conv.lastMessage = text;
      conv.lastMessageAt = new Date();
    }

    const sender = await this.findUserById(senderId);
    return {
      ...newMsg,
      sender,
    };
  },

  // STATS & ADMIN
  async getPlatformStats() {
    if (mongoose.connection.readyState === 1) {
      const [totalPets, availablePets, adoptedPets, totalApplications, totalShelters, totalAdopters] = await Promise.all([
        mongoose.model('Pet').countDocuments(),
        mongoose.model('Pet').countDocuments({ status: 'Available' }),
        mongoose.model('Pet').countDocuments({ status: 'Adopted' }),
        mongoose.model('Application').countDocuments(),
        mongoose.model('User').countDocuments({ role: 'shelter' }),
        mongoose.model('User').countDocuments({ role: 'adopter' }),
      ]);
      return { totalPets, availablePets, adoptedPets, totalApplications, totalShelters, totalAdopters };
    }

    return {
      totalPets: memoryStore.pets.length,
      availablePets: memoryStore.pets.filter((p) => p.status === 'Available').length,
      adoptedPets: memoryStore.pets.filter((p) => p.status === 'Adopted').length,
      totalApplications: memoryStore.applications.length,
      totalShelters: memoryStore.users.filter((u) => u.role === 'shelter').length,
      totalAdopters: memoryStore.users.filter((u) => u.role === 'adopter').length,
    };
  },
};
