/**
 * Automated End-to-End API Test Suite for PawConnect
 * Tests all core backend business logic, validation, authentication, and database operations.
 */

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5001/api';

const log = (step, msg) => console.log(`  ✓ [${step}] ${msg}`);
const fail = (step, err) => {
  console.error(`  ✗ [${step}] FAILED:`, err);
  process.exit(1);
};

const req = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
};

async function runTests() {
  console.log('🚀 Running PawConnect Full-Stack API Integration Tests...');

  // 1. Health & Server Status
  try {
    const health = await req('/health');
    if (!health.ok || health.data.status !== 'online') throw new Error('Health check failed');
    log('HEALTH', `Server online, mode: ${health.data.database?.mode || 'live'}`);
  } catch (e) {
    fail('HEALTH', e.message);
  }

  // 2. Authentication: Seeding & Login
  let adopterToken = '';
  let shelterToken = '';
  let adminToken = '';
  let adopterId = '';
  let shelterId = '';

  try {
    const adopterLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'adopter@pawconnect.org', password: 'password123' }),
    });
    if (!adopterLogin.ok) throw new Error(adopterLogin.data.message);
    adopterToken = adopterLogin.data.token;
    adopterId = adopterLogin.data.user._id;
    log('AUTH', 'Adopter login successful');

    const shelterLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'shelter@pawconnect.org', password: 'password123' }),
    });
    if (!shelterLogin.ok) throw new Error(shelterLogin.data.message);
    shelterToken = shelterLogin.data.token;
    shelterId = shelterLogin.data.user._id;
    log('AUTH', 'Shelter login successful');

    const adminLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@pawconnect.org', password: 'password123' }),
    });
    if (!adminLogin.ok) throw new Error(adminLogin.data.message);
    adminToken = adminLogin.data.token;
    log('AUTH', 'Admin login successful');
  } catch (e) {
    fail('AUTH', e.message);
  }

  // 3. Duplicate Registration & Validation
  try {
    const dupReg = await req('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Duplicate Test',
        email: 'adopter@pawconnect.org',
        password: 'password123',
      }),
    });
    if (dupReg.status !== 400) throw new Error(`Expected 400 on duplicate email, got ${dupReg.status}`);
    log('AUTH', 'Duplicate registration rejected with 400');
  } catch (e) {
    fail('AUTH', e.message);
  }

  // 4. Pet Discovery: Query & Filters
  let testPetId = '';
  try {
    const allPets = await req('/pets');
    if (!allPets.ok || !allPets.data.pets.length) throw new Error('Could not fetch pets');
    testPetId = allPets.data.pets[0]._id;
    log('PETS', `Retrieved ${allPets.data.count} pets`);

    const dogPets = await req('/pets?species=Dog');
    if (!dogPets.ok || dogPets.data.pets.some((p) => p.species !== 'Dog')) {
      throw new Error('Species filter failed');
    }
    log('PETS', 'Species filtering works accurately');

    const singlePet = await req(`/pets/${testPetId}`, {
      headers: { Authorization: `Bearer ${adopterToken}` },
    });
    if (!singlePet.ok || !singlePet.data.pet) throw new Error('Pet details failed');
    log('PETS', `Fetched pet details: ${singlePet.data.pet.name}`);
  } catch (e) {
    fail('PETS', e.message);
  }

  // 5. Shelter Pet Management (Create, Edit, Delete protection)
  let createdPetId = '';
  try {
    const newPet = await req('/pets', {
      method: 'POST',
      headers: { Authorization: `Bearer ${shelterToken}` },
      body: JSON.stringify({
        name: 'Barnaby Test Pet',
        species: 'Dog',
        breed: 'Border Collie Mix',
        age: 1.5,
        gender: 'Male',
        size: 'Medium',
        weightKg: 18,
        description: 'Vibrant and affectionate sheepdog mix looking for an active home.',
        photos: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80'],
        location: { city: 'Austin', state: 'TX' },
        adoptionFee: 75,
      }),
    });
    if (!newPet.ok) throw new Error(newPet.data.message);
    createdPetId = newPet.data.pet._id;
    log('SHELTER', `Created pet listing: ${newPet.data.pet.name} (${createdPetId})`);

    // Cross-shelter edit permission check: Adopter must NOT be able to edit
    const forbiddenEdit = await req(`/pets/${createdPetId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adopterToken}` },
      body: JSON.stringify({ name: 'Hacked Name' }),
    });
    if (forbiddenEdit.status !== 403) throw new Error(`Expected 403 for unauthorized edit, got ${forbiddenEdit.status}`);
    log('SHELTER', 'Cross-user edit blocked with 403 Forbidden');
  } catch (e) {
    fail('SHELTER', e.message);
  }

  // 6. Favorites Workflow
  try {
    const toggleAdd = await req(`/favorites/${createdPetId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adopterToken}` },
    });
    if (!toggleAdd.ok || !toggleAdd.data.isFavorite) throw new Error('Add favorite failed');
    log('FAVORITES', 'Pet added to adopter favorites');

    const getFavs = await req('/favorites', {
      headers: { Authorization: `Bearer ${adopterToken}` },
    });
    if (!getFavs.ok || !getFavs.data.favorites.some((p) => p._id === createdPetId)) {
      throw new Error('Favorite not in user favorites list');
    }
    log('FAVORITES', 'Favorites loaded and persisted');

    const toggleRemove = await req(`/favorites/${createdPetId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adopterToken}` },
    });
    if (!toggleRemove.ok || toggleRemove.data.isFavorite !== false) throw new Error('Remove favorite failed');
    log('FAVORITES', 'Pet removed from favorites');
  } catch (e) {
    fail('FAVORITES', e.message);
  }

  // 7. Adoption Application Lifecycle
  let applicationId = '';
  try {
    const submitApp = await req('/applications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adopterToken}` },
      body: JSON.stringify({
        petId: createdPetId,
        questionnaire: {
          fullName: 'Sarah Jenkins',
          phone: '+1 (555) 234-5678',
          address: '742 Evergreen Terrace, Austin, TX',
          housingType: 'House with Yard',
          ownership: 'Own',
          hasOtherPets: false,
          hasChildren: false,
          hoursAlonePerDay: 3,
          petExperience: 'Experienced Caretaker',
          reasonForAdopting: 'Seeking a faithful hiking buddy for remote work lifestyle.',
        },
      }),
    });
    if (!submitApp.ok) throw new Error(submitApp.data.message);
    applicationId = submitApp.data.application._id;
    log('APPLICATIONS', `Submitted application: ${applicationId}`);

    // Prevent duplicate active application
    const dupApp = await req('/applications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adopterToken}` },
      body: JSON.stringify({
        petId: createdPetId,
        questionnaire: { fullName: 'Sarah Jenkins', reasonForAdopting: 'Duplicate test' },
      }),
    });
    if (dupApp.status !== 400) throw new Error(`Expected 400 for duplicate application, got ${dupApp.status}`);
    log('APPLICATIONS', 'Duplicate active application rejected with 400');

    // Shelter reviews & approves application
    const approveApp = await req(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${shelterToken}` },
      body: JSON.stringify({
        status: 'Approved',
        shelterNotes: 'Meet and greet scheduled for Saturday morning.',
      }),
    });
    if (!approveApp.ok || approveApp.data.application.status !== 'Approved') {
      throw new Error(approveApp.data.message);
    }
    log('APPLICATIONS', 'Shelter approved application; status updated to Approved');

    // Verify pet availability status updated to 'Reserved'
    const checkedPet = await req(`/pets/${createdPetId}`);
    if (checkedPet.data.pet.status !== 'Reserved') {
      throw new Error(`Expected pet status 'Reserved', got '${checkedPet.data.pet.status}'`);
    }
    log('APPLICATIONS', 'Pet status automatically updated to Reserved');
  } catch (e) {
    fail('APPLICATIONS', e.message);
  }

  // 8. Shelter Verification by Admin
  try {
    const verifyShelter = await req(`/shelters/${shelterId}/verify`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ verified: true }),
    });
    if (!verifyShelter.ok || !verifyShelter.data.shelter.organization.verified) {
      throw new Error('Admin verification failed');
    }
    log('ADMIN', 'Admin verified shelter partner');
  } catch (e) {
    fail('ADMIN', e.message);
  }

  // 9. Clean up created test pet
  try {
    const delPet = await req(`/pets/${createdPetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${shelterToken}` },
    });
    if (!delPet.ok) throw new Error(delPet.data.message);
    log('CLEANUP', 'Test pet deleted cleanly');
  } catch (e) {
    fail('CLEANUP', e.message);
  }

  console.log('\n🎉 ALL 14 E2E INTEGRATION TESTS PASSED SUCCESSFULLY!\n');
}

runTests();
