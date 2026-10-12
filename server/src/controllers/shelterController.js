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

export const verifyShelter = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified = true } = req.body;

    const shelter = await repository.findUserById(id);
    if (!shelter || shelter.role !== 'shelter') {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    const updatedShelter = await repository.updateUser(id, {
      organization: {
        ...shelter.organization,
        verified: Boolean(verified),
      },
    });

    res.json({
      message: `Shelter verification updated to ${Boolean(verified)}`,
      shelter: updatedShelter,
    });
  } catch (error) {
    console.error('verifyShelter error:', error);
    res.status(500).json({ message: 'Failed to update shelter verification', error: error.message });
  }
};

