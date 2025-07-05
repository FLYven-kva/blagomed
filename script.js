// Import necessary libraries
const AOS = window.AOS // Declare AOS variable
const bootstrap = window.bootstrap // Declare bootstrap variable

// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  easing: "ease-in-out",
  once: true,
  offset: 100,
})

// Contact Modal Functions
function openContactModal() {
  const modal = new bootstrap.Modal(document.getElementById("contactModal"))
  modal.show()
}

// Image Modal Functions
function openImageModal(imageSrc) {
  const modal = new bootstrap.Modal(document.getElementById("imageModal"))
  const modalImage = document.getElementById("modalImage")
  modalImage.src = imageSrc
  modal.show()
}

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".custom-navbar")
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Loading animation for buttons
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function () {
    if (this.classList.contains("btn-appointment") || this.classList.contains("btn-primary")) {
      const originalText = this.innerHTML
      this.innerHTML = '<span class="loading"></span> Загрузка...'
      this.disabled = true

      setTimeout(() => {
        this.innerHTML = originalText
        this.disabled = false
      }, 1000)
    }
  })
})

// Form validation (if forms are added later)
function validateForm(form) {
  const inputs = form.querySelectorAll("input[required], textarea[required]")
  let isValid = true

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("is-invalid")
      isValid = false
    } else {
      input.classList.remove("is-invalid")
    }
  })

  return isValid
}

// Phone number formatting
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, "")
  if (value.length >= 1) {
    value =
      "+7 (" +
      value.substring(1, 4) +
      ") " +
      value.substring(4, 7) +
      "-" +
      value.substring(7, 9) +
      "-" +
      value.substring(9, 11)
  }
  input.value = value
}

// Add phone formatting to phone inputs
document.querySelectorAll('input[type="tel"]').forEach((input) => {
  input.addEventListener("input", function () {
    formatPhoneNumber(this)
  })
})

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate")
    }
  })
}, observerOptions)

// Observe elements for animation
document.querySelectorAll(".service-card, .doctor-card, .benefit-item").forEach((el) => {
  observer.observe(el)
})

// Counter animation for statistics (if added)
function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)

  const timer = setInterval(() => {
    start += increment
    element.textContent = Math.floor(start)

    if (start >= target) {
      element.textContent = target
      clearInterval(timer)
    }
  }, 16)
}

// Initialize counters when they come into view
const counterElements = document.querySelectorAll(".counter")
counterElements.forEach((counter) => {
  const target = Number.parseInt(counter.getAttribute("data-target"))

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(counter, target)
        counterObserver.unobserve(counter)
      }
    })
  })

  counterObserver.observe(counter)
})

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      img.classList.remove("lazy")
      imageObserver.unobserve(img)
    }
  })
})

document.querySelectorAll("img[data-src]").forEach((img) => {
  imageObserver.observe(img)
})

// Back to top button
const backToTopButton = document.createElement("button")
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>'
backToTopButton.className = "back-to-top"
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--red-accent);
    color: white;
    border: none;
    font-size: 18px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
`

document.body.appendChild(backToTopButton)

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopButton.style.opacity = "1"
    backToTopButton.style.visibility = "visible"
  } else {
    backToTopButton.style.opacity = "0"
    backToTopButton.style.visibility = "hidden"
  }
})

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
})

// Service worker registration (for PWA features)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}

// Error handling for images
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", function () {
    this.src = "/placeholder.svg?height=300&width=400&text=Изображение недоступно"
  })
})

// Print functionality
function printPage() {
  window.print()
}

// Share functionality
async function shareContent(title, text, url) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: text,
        url: url,
      })
    } catch (err) {
      console.log("Error sharing:", err)
    }
  } else {
    // Fallback for browsers that don't support Web Share API
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`
    window.open(shareUrl, "_blank")
  }
}

// Cookie consent (basic implementation)
function showCookieConsent() {
  if (!localStorage.getItem("cookieConsent")) {
    const consent = document.createElement("div")
    consent.className = "cookie-consent"
    consent.innerHTML = `
            <div class="cookie-content">
                <p>Мы используем файлы cookie для улучшения работы сайта.</p>
                <button onclick="acceptCookies()" class="btn btn-primary btn-sm">Принять</button>
            </div>
        `
    consent.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--dark-blue);
            color: white;
            padding: 1rem;
            z-index: 1001;
        `
    document.body.appendChild(consent)
  }
}

function acceptCookies() {
  localStorage.setItem("cookieConsent", "true")
  document.querySelector(".cookie-consent").remove()
}

// Initialize cookie consent
setTimeout(showCookieConsent, 2000)

// Performance monitoring
window.addEventListener("load", () => {
  const loadTime = performance.now()
  console.log(`Page loaded in ${loadTime.toFixed(2)}ms`)
})
