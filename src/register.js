// Registration Form Handler
const registrationForm = document.getElementById('registration-form');
const successModal = document.getElementById('success-modal');

// Generate Registration ID
function generateRegistrationId() {
    const prefix = 'ASTRA';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${year}-${random}`;
}

// Form Submission Handler
if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(registrationForm);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!data.fullname || !data.email || !data.phone || !data.college || !data.department || !data.year || !data.event) {
            alert('Please fill in all required fields');
            return;
        }

        // Generate registration ID
        const registrationId = generateRegistrationId();

        // Store registration data (in production, send to backend)
        const registration = {
            ...data,
            registrationId,
            timestamp: new Date().toISOString()
        };

        console.log('Registration submitted:', registration);

        // Show success modal
        document.getElementById('reg-id').textContent = registrationId;
        successModal.style.display = 'flex';

        // Reset form
        registrationForm.reset();
    });
}

// Close Success Modal
window.closeSuccessModal = function () {
    successModal.style.display = 'none';
    // Optionally redirect to home
    // window.location.href = 'index.html';
};

// Event card selection visual feedback
const eventCards = document.querySelectorAll('.event-card');
eventCards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');

    card.addEventListener('click', () => {
        // Remove selected class from all cards
        eventCards.forEach(c => c.classList.remove('selected'));
        // Add selected class to clicked card
        card.classList.add('selected');
        // Check the radio button
        radio.checked = true;
    });

    // Add selected class if already checked
    if (radio.checked) {
        card.classList.add('selected');
    }
});
