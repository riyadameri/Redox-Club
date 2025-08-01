document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('csl-form');
    const messageDiv = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Get all selected courses
        const courses = Array.from(document.querySelectorAll('input[name="courses"]:checked')).map(
            checkbox => checkbox.value
        );
        data.courses = courses;

        // Simple client-side validation for courses
        if (courses.length === 0) {
            messageDiv.textContent = 'Please select at least one course.';
            messageDiv.className = 'error';
            return;
        }

        // Disable button and show loading state
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';
        messageDiv.textContent = '';
        messageDiv.className = '';

        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                messageDiv.textContent = 'Registration successful! Check your email for confirmation.';
                messageDiv.className = 'success';
                form.reset();
            } else {
                messageDiv.textContent = result.error || 'An error occurred during registration.';
                messageDiv.className = 'error';
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'Network error. Please try again later.';
            messageDiv.className = 'error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';
        }
    });
});