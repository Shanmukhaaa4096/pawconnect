import { repository } from '../store/inMemoryStore.js';

export const getShelters = async (req, res) => {
  try {
    const shelters = await repository.findShelters();
    res.json({ count: shelters.length, shelters });
  } catch (error) {
    console.error('getShelters error:', error);
    res.status(500).json({ message: 'Failed to retrieve shelters', error: error.message });
  }
};

export const getShelterById = async (req, res) => {
  try {
    const shelter = await repository.findUserById(req.params.id);
    if (!shelter || shelter.role !== 'shelter') {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    const pets = await repository.findPets({ shelterId: shelter._id });
    res.json({ shelter, pets });
  } catch (error) {
    console.error('getShelterById error:', error);
    res.status(500).json({ message: 'Failed to retrieve shelter details', error: error.message });
  }
};

export const getPlatformStats = async (req, res) => {
  try {
    const stats = await repository.getPlatformStats();
    res.json({ stats });
  } catch (error) {
    console.error('getPlatformStats error:', error);
    res.status(500).json({ message: 'Failed to retrieve platform stats', error: error.message });
  }
};
