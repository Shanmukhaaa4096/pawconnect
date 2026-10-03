import { repository } from '../store/inMemoryStore.js';

export const createApplication = async (req, res) => {
  try {
    const { petId, questionnaire } = req.body;

    if (!petId || !questionnaire) {
      return res.status(400).json({ message: 'Pet ID and adoption questionnaire are required' });
    }

    const pet = await repository.findPetById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.status === 'Adopted') {
      return res.status(400).json({ message: 'This pet has already been adopted' });
    }

    const shelterId = pet.shelter?._id || pet.shelter;

    const application = await repository.createApplication({
      pet: pet._id,
      adopter: req.user._id,
      shelter: shelterId,
      status: 'Pending',
      questionnaire: {
        fullName: questionnaire.fullName || req.user.name,
        phone: questionnaire.phone || req.user.phone || '',
        address: questionnaire.address || '',
        housingType: questionnaire.housingType || 'Apartment',
        ownership: questionnaire.ownership || 'Rent',
        hasOtherPets: Boolean(questionnaire.hasOtherPets),
        otherPetsDetails: questionnaire.otherPetsDetails || '',
        hasChildren: Boolean(questionnaire.hasChildren),
        childrenAges: questionnaire.childrenAges || '',
        hoursAlonePerDay: Number(questionnaire.hoursAlonePerDay) || 4,
        petExperience: questionnaire.petExperience || 'Experienced Caretaker',
        reasonForAdopting: questionnaire.reasonForAdopting || 'To give this pet a safe and loving home.',
      },
      shelterNotes: '',
    });

    res.status(201).json({
      message: 'Adoption application submitted successfully!',
      application,
    });
  } catch (error) {
    console.error('createApplication error:', error);
    res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await repository.findApplicationsByAdopter(req.user._id);
    res.json({ count: applications.length, applications });
  } catch (error) {
    console.error('getMyApplications error:', error);
    res.status(500).json({ message: 'Failed to fetch your applications', error: error.message });
  }
};

export const getShelterApplications = async (req, res) => {
  try {
    const applications = await repository.findApplicationsByShelter(req.user._id);
    res.json({ count: applications.length, applications });
  } catch (error) {
    console.error('getShelterApplications error:', error);
    res.status(500).json({ message: 'Failed to fetch shelter applications', error: error.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await repository.findApplicationById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Access check: Only the applicant adopter, the shelter, or an admin can view
    const adopterId = application.adopter?._id || application.adopter;
    const shelterId = application.shelter?._id || application.shelter;
    const isOwner = adopterId?.toString() === req.user._id.toString();
    const isShelter = shelterId?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isShelter && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this application' });
    }

    res.json({ application });
  } catch (error) {
    console.error('getApplicationById error:', error);
    res.status(500).json({ message: 'Failed to retrieve application', error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, shelterNotes } = req.body;
    const allowed = ['Pending', 'Approved', 'Rejected', 'Completed'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const application = await repository.findApplicationById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const shelterId = application.shelter?._id || application.shelter;
    if (shelterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    const updatedApp = await repository.updateApplicationStatus(req.params.id, {
      status,
      shelterNotes,
    });

    res.json({
      message: `Application status updated to ${status}`,
      application: updatedApp,
    });
  } catch (error) {
    console.error('updateApplicationStatus error:', error);
    res.status(500).json({ message: 'Failed to update application status', error: error.message });
  }
};
