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
        const inputs = currentFormStep.querySelectorAll('input[required], input[type="number"]');
        const choiceGroups = currentFormStep.querySelectorAll('[data-required="true"]');
        let isValid = true;

        inputs.forEach(input => {
            const errorMessage = input.nextElementSibling;
            if (input.type === 'email') {
                const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    input.style.borderColor = 'red';
                    errorMessage.textContent = input.dataset.error;
                } else {
                    input.style.borderColor = '#ccc';
                    errorMessage.textContent = '';
                }
            } else if (input.type === 'number') {
                if (input.value === '' || input.value < 0) {
                    isValid = false;
                    input.style.borderColor = 'red';
                    errorMessage.textContent = input.dataset.error;
                } else {
                    input.style.borderColor = '#ccc';
                    errorMessage.textContent = '';
                }
            } else if (input.required && !input.value) {
                isValid = false;
                input.style.borderColor = 'red';
                errorMessage.textContent = input.dataset.error;
            } else {
                input.style.borderColor = '#ccc';
                errorMessage.textContent = '';
            }
        });

        choiceGroups.forEach(group => {
            const choices = group.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            const errorMessage = group.querySelector('.error-message');
            if ([...choices].every(choice => !choice.checked)) {
                isValid = false;
                if (errorMessage) {
                    errorMessage.textContent = "Please select an option.";
                }
            } else {
                if (errorMessage) {
                    errorMessage.textContent = "";
                }
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
            form.style.display = 'none';
            document.getElementById('progress-bar').style.display = 'none';
            document.getElementById('success-message').style.display = 'block';
        }
    });

    updateFormSteps();
});
