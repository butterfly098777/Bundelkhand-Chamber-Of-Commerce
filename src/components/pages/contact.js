'use client';

import { useEffect } from 'react';

export default function InitScrollScript() {
  useEffect(() => {
   const imagePaths = [
  "/resources/image1.png",
  "/resources/image2.png",
  "/resources/image3.png",
  "/resources/image4.png"
];


    const scrollTrack = document.getElementById("scroll-track");

    function populateImages() {
      for (let i = 0; i < 2; i++) {
        imagePaths.forEach((src) => {
          const img = document.createElement("img");
          img.src = src;
           console.log("Appending image:", img.src);
          scrollTrack.appendChild(img);
        });
     

      }
    }

    let scrollX = 0;
    function animate() {
      scrollX -= 3.0;
      const resetAt = scrollTrack.scrollWidth / 2;
      if (Math.abs(scrollX) >= resetAt) {
        scrollX = 0;
      }
      scrollTrack.style.transform = `translateX(${scrollX}px)`;
      requestAnimationFrame(animate);
    }

    populateImages();
    requestAnimationFrame(animate);


    // === CONTACT FORM HANDLER ===
    const form = document.querySelector('#contact-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
       console.log('Form submitted'); // Debug log
        const formData = {
          name: document.querySelector('input[name="name"]').value,
          email: document.querySelector('input[name="email"]').value,
          phone: document.querySelector('input[name="phone"]').value,
          typeMessage: document.querySelector('textarea[name="typeMessage"]').value,
        };
        console.log('Form data:', formData); // Debug log
        try {
          const res = await fetch('http://localhost:5000/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

         console.log('Response status:', res.status); // Debug log
    const data = await res.json();
    console.log('Response data:', data); // Debug log
          if (res.ok) {
            alert('✅ Message sent successfully!');
            form.reset();
          } else {
            alert(`❌ Error: ${data.error || 'Something went wrong'}`);
          }
        } catch (err) {
          console.error('Fetch error:', err); // Debug log
          alert('❌ Failed to send message. Check console for details.');
        }
      });
    }

  }, []);

  return null;
}
