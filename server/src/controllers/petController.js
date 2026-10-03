import { repository } from '../store/inMemoryStore.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

export const getPets = async (req, res) => {
  try {
    const { species, breed, ageGroup, status, location, gender, size, search, shelterId } = req.query;
    const pets = await repository.findPets({
      species,
      breed,
      ageGroup,
      status,
      location,
      gender,
      size,
      search,
      shelterId,
    });
    res.json({ count: pets.length, pets });
  } catch (error) {
    console.error('getPets error:', error);
    res.status(500).json({ message: 'Failed to retrieve pets', error: error.message });
  }
};

export const getPetById = async (req, res) => {
  try {
    const pet = await repository.findPetById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    let isFavorite = false;
    if (req.user) {
      isFavorite = await repository.checkIsFavorite(req.user._id, pet._id);
    }

    res.json({ pet, isFavorite });
  } catch (error) {
    console.error('getPetById error:', error);
    res.status(500).json({ message: 'Failed to retrieve pet details', error: error.message });
  }
};

export const createPet = async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      gender,
      size,
      weightKg,
      health,
      temperament,
      goodWith,
      description,
      photos: existingPhotos,
      location,
      adoptionFee,
      status,
    } = req.body;

    if (!name || !species || !breed || age === undefined || !gender || !description) {
      return res.status(400).json({ message: 'Required fields missing (name, species, breed, age, gender, description)' });
    }

    const uploadedPhotoUrls = [];

    // Process files uploaded via Multer
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, file.mimetype, 'pawconnect/pets');
        uploadedPhotoUrls.push(url);
      }
    }

    // Combine any raw string URLs passed
    let allPhotos = [...uploadedPhotoUrls];
    if (existingPhotos) {
      const parsedPhotos = typeof existingPhotos === 'string' ? JSON.parse(existingPhotos) : existingPhotos;
      if (Array.isArray(parsedPhotos)) {
        allPhotos = [...allPhotos, ...parsedPhotos];
      }
    }

    // Default cute placeholder if none provided
    if (allPhotos.length === 0) {
      allPhotos.push(
        species === 'Cat'
          ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80'
          : 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=80'
      );
    }

    // Parse JSON fields if sent as multipart form data
    const parsedHealth = typeof health === 'string' ? JSON.parse(health) : health || { vaccinated: true, spayedNeutered: true };
    const parsedTemperament = typeof temperament === 'string' ? JSON.parse(temperament) : temperament || ['Friendly'];
    const parsedGoodWith = typeof goodWith === 'string' ? JSON.parse(goodWith) : goodWith || { children: true, dogs: true, cats: true };
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location || req.user.location || { city: 'Austin', state: 'TX' };

    const newPet = await repository.createPet({
      name,
      species,
      breed,
      age: Number(age),
      gender,
      size: size || 'Medium',
      weightKg: weightKg ? Number(weightKg) : 0,
      health: parsedHealth,
      temperament: parsedTemperament,
      goodWith: parsedGoodWith,
      description,
      photos: allPhotos,
      location: parsedLocation,
      adoptionFee: adoptionFee ? Number(adoptionFee) : 50,
      status: status || 'Available',
      shelter: req.user._id,
    });

    res.status(201).json({ message: 'Pet listed successfully', pet: newPet });
  } catch (error) {
    console.error('createPet error:', error);
    res.status(500).json({ message: 'Failed to create pet listing', error: error.message });
  }
};

export const updatePet = async (req, res) => {
  try {
    const pet = await repository.findPetById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    // Authorization: Must be owner shelter or admin
    const shelterId = pet.shelter?._id || pet.shelter;
    if (shelterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify this pet' });
    }

    const updatedPet = await repository.updatePet(req.params.id, req.body);
    res.json({ message: 'Pet updated successfully', pet: updatedPet });
  } catch (error) {
    console.error('updatePet error:', error);
    res.status(500).json({ message: 'Failed to update pet', error: error.message });
  }
};

export const deletePet = async (req, res) => {
  try {
    const pet = await repository.findPetById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    const shelterId = pet.shelter?._id || pet.shelter;
    if (shelterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this pet' });
    }

    await repository.deletePet(req.params.id);
    res.json({ message: 'Pet listing deleted successfully' });
  } catch (error) {
    console.error('deletePet error:', error);
    res.status(500).json({ message: 'Failed to delete pet', error: error.message });
  }
};

export const updatePetStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Available', 'Reserved', 'Adopted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Available, Reserved, or Adopted' });
    }

    const pet = await repository.findPetById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    const shelterId = pet.shelter?._id || pet.shelter;
    if (shelterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update status' });
    }

    const updatedPet = await repository.updatePet(req.params.id, { status });
    res.json({ message: `Pet status changed to ${status}`, pet: updatedPet });
  } catch (error) {
    console.error('updatePetStatus error:', error);
    res.status(500).json({ message: 'Failed to update pet status', error: error.message });
  }
};
