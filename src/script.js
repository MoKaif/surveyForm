document.addEventListener('DOMContentLoaded', () => {
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const progressBar = document.getElementById('progress');
    const form = document.getElementById('survey-form');

    let currentStep = 0;

    const updateFormSteps = () => {
        formSteps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        progressBar.style.width = `${(currentStep / (formSteps.length - 1)) * 100}%`;
    };

    const validateStep = () => {
        const currentFormStep = formSteps[currentStep];
        const inputs = currentFormStep.querySelectorAll('input[required]');
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '#ccc';
            }
        });
        return isValid;
    };

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep()) {
                currentStep++;
                if (currentStep >= formSteps.length) {
                    currentStep = formSteps.length - 1;
                }
                updateFormSteps();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            if (currentStep < 0) {
                currentStep = 0;
            }
            updateFormSteps();
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateStep()) {
            // Handle form submission
            console.log('Form submitted!');
        }
    });

    updateFormSteps();
});
