import { repository } from '../store/inMemoryStore.js';
import { notify } from '../utils/notify.js';

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


const summarize = (reviews) => {
  const count = reviews.length;
  const average = count ? Math.round((reviews.reduce((n, r) => n + r.rating, 0) / count) * 10) / 10 : 0;
  return { count, average };
};

export const getShelterReviews = async (req, res) => {
  try {
    const reviews = await repository.getReviewsByShelter(req.params.id);
    res.json({ reviews, ...summarize(reviews) });
  } catch (error) {
    console.error('getShelterReviews error:', error);
    res.status(500).json({ message: 'Failed to load reviews', error: error.message });
  }
};

export const addShelterReview = async (req, res) => {
  try {
    const { applicationId, comment = '' } = req.body;
    const rating = Number(req.body.rating);

    if (!applicationId) return res.status(400).json({ message: 'applicationId is required' });
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a whole number from 1 to 5' });
    }

    const shelter = await repository.findUserById(req.params.id);
    if (!shelter || shelter.role !== 'shelter') return res.status(404).json({ message: 'Shelter not found' });

    const application = await repository.findApplicationById(applicationId);
    const adopterId = application?.adopter?._id || application?.adopter;
    const appShelterId = application?.shelter?._id || application?.shelter;
    if (
      !application ||
      adopterId?.toString() !== req.user._id.toString() ||
      appShelterId?.toString() !== req.params.id.toString()
    ) {
      return res.status(403).json({ message: 'You can only review a shelter you adopted from' });
    }
    if (application.status !== 'Completed') {
      return res.status(400).json({ message: 'You can review a shelter after the adoption is completed' });
    }
    if (await repository.findReviewByApplication(applicationId)) {
      return res.status(400).json({ message: 'You already reviewed this adoption' });
    }

    const review = await repository.createReview({
      shelter: req.params.id,
      adopter: req.user._id,
      application: applicationId,
      rating,
      comment: String(comment).slice(0, 500),
    });

    notify(req.params.id, {
      type: 'review',
      title: `New ${rating}-star review`,
      body: `${req.user.name} reviewed your shelter.`,
      link: `/shelters/${req.params.id}`,
    });

    res.status(201).json({ message: 'Thanks for your review!', review });
  } catch (error) {
    console.error('addShelterReview error:', error);
    res.status(500).json({ message: 'Failed to save review', error: error.message });
  }
};
