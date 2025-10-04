// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  const formBtn = document.querySelector(".btn-continue");
  const emailInput = document.querySelector(".input-box");

  formBtn.addEventListener("click", function (e) {
    e.preventDefault(); // prevent direct navigation

    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation
    if (!emailValue) {
      alert("Please enter your email.");
      return;
    }
    if (!emailPattern.test(emailValue)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Success message
    alert("🎉 Sign up successful! Welcome to Music.");

    // Redirect after confirmation
    window.location.href = "/html/Home.html";
  });

  // Make sure UI adjusts nicely on small devices
  function resizeHandler() {
    const signupBox = document.querySelector(".signup-box");
    if (window.innerWidth < 400) {
      signupBox.style.padding = "20px 15px";
    } else {
      signupBox.style.padding = "";
    }
  }
  window.addEventListener("resize", resizeHandler);
  resizeHandler();
});

