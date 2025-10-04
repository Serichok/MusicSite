document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".input-box");
  const continueBtn = document.querySelector(".btn-continue");
  const formBox = document.querySelector(".login-box");

  // Create error/confirmation message containers
  const msg = document.createElement("p");
  msg.style.fontSize = "14px";
  msg.style.marginTop = "10px";
  msg.style.color = "tomato";
  msg.style.display = "none";
  formBox.appendChild(msg);

  continueBtn.addEventListener("click", (e) => {
    e.preventDefault(); // prevent redirect

    const value = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      msg.textContent = "This field is required.";
      msg.style.color = "tomato";
      msg.style.display = "block";
      return;
    }

    // If it looks like an email, validate it
    if (value.includes("@") && !emailRegex.test(value)) {
      msg.textContent = "Please enter a valid email address.";
      msg.style.color = "tomato";
      msg.style.display = "block";
      return;
    }

    // Success message
    msg.textContent = "✅ Successfully submitted!";
    msg.style.color = "#1db954";
    msg.style.display = "block";

    alert("Succesfully logged in ✅")

    // Simulate redirect after short delay
    setTimeout(() => {
      window.location.href = "/html/Home.html";
    }, 1500);
  });
});
