// APIs

//Google ReCaptcha
grecaptcha.ready(function() {
    // Asks Google: Is this a human visiting?
    grecaptcha.execute('6LdUGDYsAAAAABWLd2FdBxvC0cVpqMtmRZ2xS0ww', {action: 'homepage_load'}).then(function(token) {
        
        // v3 token to user
        fetch('/api/users/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'visit',
                token: token // token
            })
        });
        
    });
});

// API  token route
fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        name: name,
        email: email, 
        message: message,
        token: captchaResponse
    })
})

//EmailJS
(function() {
    // APIs:
    const API_BASE = 'api/users'; 

    // Initialize EmailJS immediately if the library is loaded
    if (window.emailjs) {
        emailjs.init("nnrzGym76bTtHhajW"); // Public API Key
        console.log("EmailJS Initialized");
    } else {
        console.error("EmailJS library not found."); // Check your HTML script order if error.
    }

    // Logic:
    // Loads and confirms form codes
    document.addEventListener('DOMContentLoaded', () => {
        
        const contactForm = document.querySelector('form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault(); 
                


                const name = document.getElementById('name').value;                
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;
                const submitBtn = contactForm.querySelector('input[type="submit"]');

                // Visual Feedback
                submitBtn.value = "Sending...";
                submitBtn.disabled = true;

                // EmailJS Verification
                const emailParams = {
                    from_name: name,
                    reply_to: email,
                    message: message
                };

                // IDs
                emailjs.send('service_6y18s1f', 'template_itxcxdj', emailParams)
                    .then(() => {
                        console.log('Verification Succesful');
                    })
                    .catch((error) => {
                        console.error('Verification failed', error);
                    });

                // Saving to EmailJS
                fetch(`${API_BASE}/feedback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        name: name,
                        email: email, 
                        message: message 
                    })
                })
                .then(response => {
                    if (response.ok) {
                        alert('Thank you! Your feedback has been sent.');
                        contactForm.reset(); 
                    } else {
                        alert('Error');
                    }
                })
                .catch(() => alert('EmailJS is not responding.'))
                .finally(() => {
                    submitBtn.value = "Send Message";
                    submitBtn.disabled = false;
                });
            });
        }
    });

})();