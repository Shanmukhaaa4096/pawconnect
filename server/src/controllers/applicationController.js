import { repository } from '../store/inMemoryStore.js';
import { notify } from '../utils/notify.js';

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

    // Prevent duplicate active applications
    const existingApps = await repository.findApplicationsByAdopter(req.user._id);
    const hasActiveApp = existingApps.some(
      (app) =>
        (app.pet?._id?.toString() === pet._id.toString() || app.pet?.toString() === pet._id.toString()) &&
        ['Pending', 'Approved'].includes(app.status)
    );
    if (hasActiveApp) {
      return res.status(400).json({
        message: 'You already have an active application in review for this pet.',
      });
    }

    const shelterId = pet.shelter?._id || pet.shelter;
    if (shelterId?.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot apply for your own pet' });
    }

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

    notify(shelterId, {
      type: 'application',
      title: `New application for ${pet.name}`,
      body: `${req.user.name} wants to adopt ${pet.name}.`,
      link: '/dashboard',
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

    const adopterId = application.adopter?._id || application.adopter;
    const petName = updatedApp?.pet?.name || application.pet?.name || 'your pet';
    const verb = { Approved: 'approved', Rejected: 'declined', Completed: 'completed', Pending: 'moved back to review' }[status];
    notify(adopterId, {
      type: 'application',
      title: `Application ${verb}`,
      body: `Your application for ${petName} was ${verb}.${shelterNotes ? ` Note: ${shelterNotes}` : ''}`,
      link: '/dashboard',
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

export const withdrawApplication = async (req, res) => {
  try {
    const application = await repository.findApplicationById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const adopterId = application.adopter?._id || application.adopter;
    if (adopterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only withdraw your own application' });
    }
    if (application.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending applications can be withdrawn' });
    }

    const updated = await repository.updateApplicationStatus(req.params.id, { status: 'Withdrawn' });

    const shelterId = application.shelter?._id || application.shelter;
    notify(shelterId, {
      type: 'application',
      title: 'Application withdrawn',
      body: `${req.user.name} withdrew their application for ${application.pet?.name || 'a pet'}.`,
      link: '/dashboard',
    });

    res.json({ message: 'Application withdrawn', application: updated });
  } catch (error) {
    console.error('withdrawApplication error:', error);
    res.status(500).json({ message: 'Failed to withdraw application', error: error.message });
  }
};

export const updateHandover = async (req, res) => {
  try {
    const application = await repository.findApplicationById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const shelterId = application.shelter?._id || application.shelter;
    if (shelterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the pet lister can update the handover' });
    }
    if (!['Approved', 'Completed'].includes(application.status)) {
      return res.status(400).json({ message: 'Handover opens once the application is approved' });
    }

    const changes = {};
    ['meetGreet', 'homeCheck', 'vetRecords', 'agreement'].forEach((k) => {
      if (req.body[k] !== undefined) changes[k] = Boolean(req.body[k]);
    });
    let dateChanged = false;
    if (req.body.handoverDate !== undefined) {
      if (req.body.handoverDate === null || req.body.handoverDate === '') {
        changes.handoverDate = null;
      } else {
        const d = new Date(req.body.handoverDate);
        if (Number.isNaN(d.getTime())) return res.status(400).json({ message: 'Invalid handover date' });
        changes.handoverDate = d;
      }
      const prev = application.handover?.handoverDate ? new Date(application.handover.handoverDate).getTime() : null;
      dateChanged = (changes.handoverDate ? changes.handoverDate.getTime() : null) !== prev;
    }

    const updated = await repository.updateApplicationHandover(req.params.id, changes);

    if (dateChanged && changes.handoverDate) {
      const adopterId = application.adopter?._id || application.adopter;
      notify(adopterId, {
        type: 'application',
        title: 'Handover date set',
        body: `Handover for ${application.pet?.name || 'your pet'} is planned for ${changes.handoverDate.toDateString()}.`,
        link: '/dashboard',
      });
    }

    res.json({ message: 'Handover updated', application: updated });
  } catch (error) {
    console.error('updateHandover error:', error);
    res.status(500).json({ message: 'Failed to update handover', error: error.message });
  }
};
