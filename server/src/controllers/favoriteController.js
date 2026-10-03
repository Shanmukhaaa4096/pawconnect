import { repository } from '../store/inMemoryStore.js';

export const getFavorites = async (req, res) => {
  try {
    const favorites = await repository.getFavoritesByUser(req.user._id);
    res.json({ count: favorites.length, favorites });
  } catch (error) {
    console.error('getFavorites error:', error);
    res.status(500).json({ message: 'Failed to fetch favorites', error: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { petId } = req.params;
    const pet = await repository.findPetById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const result = await repository.toggleFavorite(req.user._id, petId);
    res.json({
      message: result.isFavorite ? 'Added to favorites' : 'Removed from favorites',
      ...result,
    });
  } catch (error) {
    console.error('toggleFavorite error:', error);
    res.status(500).json({ message: 'Failed to toggle favorite', error: error.message });
  }
};
