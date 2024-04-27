
document.addEventListener("DOMContentLoaded", function() {
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent default action
      window.location.href = 'signup.html'; // Redirect to signup page
    });
  });