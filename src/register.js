// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
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
        console.log('Registration form found, adding submit listener');

        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted...');

            // Get form data
            const formData = new FormData(registrationForm);
            const data = Object.fromEntries(formData);
            console.log('Form data:', data);

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
            const regIdEl = document.getElementById('reg-id');
            if (regIdEl) {
                regIdEl.textContent = registrationId;
            }

            if (successModal) {
                successModal.style.display = 'flex';
            }

            // Reset form
            registrationForm.reset();

            // Remove selected class from event cards
            document.querySelectorAll('.event-card').forEach(card => {
                card.classList.remove('selected');
            });
        });
    } else {
        console.error('Registration form not found!');
    }

    // Close Success Modal
    window.closeSuccessModal = function () {
        if (successModal) {
            successModal.style.display = 'none';
        }
        // Optionally redirect to home
        // window.location.href = 'index.html';
    };

    // Event card selection visual feedback
    const eventCards = document.querySelectorAll('.event-card');
    console.log('Event cards found:', eventCards.length);

    eventCards.forEach(card => {
        const radio = card.querySelector('input[type="radio"]');

        card.addEventListener('click', () => {
            // Remove selected class from all cards
            eventCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            card.classList.add('selected');
            // Check the radio button
            if (radio) {
                radio.checked = true;
            }
        });

        // Add selected class if already checked
        if (radio && radio.checked) {
            card.classList.add('selected');
        }
    });
});
