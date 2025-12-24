// File: browser.listener.js

document.addEventListener('DOMContentLoaded', () => {
    
    // Visual alert box automatically for automation (NOTE: Vibe Coded)
    if (!document.getElementById('network-popup')) {
        // 1. Inject Styles
        const style = document.createElement('style');
        style.innerHTML = `
            #network-popup {
                position: fixed;
                top: -100px;
                left: 0;
                width: 100%;
                background-color: #eb3b5a;
                color: #ffffff;
                text-align: center;
                padding: 16px;
                font-weight: bold;
                font-family: sans-serif;
                letter-spacing: 1px;
                z-index: 20000;
                transition: top 0.4s ease-in-out;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            #network-popup.show { top: 0; }
            #network-popup.online { background-color: #20bf6b; }
        `;
        document.head.appendChild(style);

        // HTML Elements
        const popupDiv = document.createElement('div');
        popupDiv.id = 'network-popup';
        popupDiv.innerText = 'Internet Connection Lost';
        document.body.appendChild(popupDiv);
    }

    const API_BASE = '/api/users';

    // For Statistics Board

    // User visit
    fetch(`${API_BASE}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            type: 'visit', 
            detail: 'homepage_load' 
        })
    }).catch(err => console.log('Tracking error:', err));


    // Section btn clicked
    const sectionLinks = document.querySelectorAll('#main .tiles .link');
    sectionLinks.forEach(link => {
        link.addEventListener('click', () => {
            const sectionName = link.innerText.trim();
            fetch(`${API_BASE}/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                keepalive: true, 
                body: JSON.stringify({ 
                    type: 'click', 
                    detail: sectionName 
                })
            });
        });
    });

    // Feedback form logic
    const contactForm = document.querySelector('form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

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
                    alert('Thank you! Submission successful.');
                    contactForm.reset(); 
                } else {
                    alert('Error. Please try again.');
                }
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Server seems offline.');
            });
        });
    }

    // Network Status Detection
    const popup = document.getElementById('network-popup');

    const updateNetworkStatus = () => {
        if (!popup) return;

        if (navigator.onLine) {
            // User is now online
            popup.innerText = "Connection Online";
            popup.classList.add('online'); 
            
            setTimeout(() => {
                popup.classList.remove('show');
                setTimeout(() => {
                    popup.classList.remove('online');
                    popup.innerText = "Connection Lost";
                }, 500);
            }, 3000);

        } else {
            // User is now offline
            popup.innerText = "Connection Lost";
            popup.classList.remove('online'); 
            popup.classList.add('show'); 
        }
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

});