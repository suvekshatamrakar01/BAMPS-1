// Global variables
const cart = []
let walletBalance = 450.0
let currentUser = {
  name: "John Doe",
  type: "student",
  email: "john@college.edu",
}

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

// Initialize application
function initializeApp() {
  // Initialize based on current page
  const currentPage = getCurrentPage()

  switch (currentPage) {
    case "login":
      initializeLogin()
      break
    case "signup":
      initializeSignup()
      break
    case "student-dashboard":
      initializeStudentDashboard()
      break
    case "menu-portal":
      initializeMenuPortal()
      break
    case "reviews":
      initializeReviews()
      break
    case "admin-dashboard":
      initializeAdminDashboard()
      break
    case "super-admin-dashboard":
      initializeSuperAdminDashboard()
      break
    default:
      initializeLandingPage()
  }

  // Initialize common features
  initializeNavigation()
  initializeNotifications()
}

// Get current page
function getCurrentPage() {
  const path = window.location.pathname
  const page = path.split("/").pop().split(".")[0]
  return page || "index"
}

// Landing Page Features
function initializeLandingPage() {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]')
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Animate stats on scroll
  const stats = document.querySelectorAll(".stat h3")
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateNumber(entry.target)
      }
    })
  })

  stats.forEach((stat) => observer.observe(stat))
}

// Login Page Features
function initializeLogin() {
  const loginForm = document.querySelector(".auth-form")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  // Add real-time validation
  const inputs = document.querySelectorAll("input")
  inputs.forEach((input) => {
    input.addEventListener("blur", validateField)
    input.addEventListener("input", clearFieldError)
  })
}

// Signup Page Features
function initializeSignup() {
  const signupForm = document.querySelector(".auth-form")
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup)
  }

  // Password strength indicator
  const passwordInput = document.getElementById("password")
  const confirmPasswordInput = document.getElementById("confirmPassword")

  if (passwordInput) {
    passwordInput.addEventListener("input", checkPasswordStrength)
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", checkPasswordMatch)
  }
}

// Student Dashboard Features
function initializeStudentDashboard() {
  updateWalletDisplay()
  loadRecentOrders()
  loadNotifications()

  // Add money button
  const addMoneyBtn = document.querySelector(".btn-primary")
  if (addMoneyBtn && addMoneyBtn.textContent.includes("Add Money")) {
    addMoneyBtn.addEventListener("click", showAddMoneyModal)
  }
}

// Menu Portal Features
function initializeMenuPortal() {
  initializeFilters()
  initializeSearch()
  initializeCart()
  loadMenuItems()

  // Add to cart buttons
  const addToCartBtns = document.querySelectorAll(".add-to-cart")
  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", addToCart)
  })
}

// Reviews Page Features
function initializeReviews() {
  const reviewForm = document.querySelector(".review-form")
  if (reviewForm) {
    reviewForm.addEventListener("submit", handleReviewSubmission)
  }

  // Star rating functionality
  initializeStarRating()
  loadReviews()
}

// Admin Dashboard Features
function initializeAdminDashboard() {
  loadOrdersData()
  loadMenuManagement()
  loadQualityAlerts()

  // Order status update buttons
  const updateBtns = document.querySelectorAll(".btn-primary, .btn-outline")
  updateBtns.forEach((btn) => {
    if (btn.textContent.includes("Update") || btn.textContent.includes("Mark")) {
      btn.addEventListener("click", updateOrderStatus)
    }
  })
}

// Super Admin Dashboard Features
function initializeSuperAdminDashboard() {
  const collegeForm = document.querySelector(".college-form")
  if (collegeForm) {
    collegeForm.addEventListener("submit", handleAddCollege)
  }

  loadSystemOverview()
  loadCollegesData()
}

// Authentication Functions
function handleLogin(e) {
  e.preventDefault()
  const formData = new FormData(e.target)
  const email = formData.get("email")
  const password = formData.get("password")
  const userType = formData.get("userType")

  // Basic validation
  if (!email || !password || !userType) {
    showNotification("Please fill in all fields", "error")
    return
  }

  // Simulate login process
  showLoadingState(e.target)

  setTimeout(() => {
    hideLoadingState(e.target)

    // Simulate successful login
    currentUser = {
      name: email.split("@")[0],
      type: userType,
      email: email,
    }

    showNotification("Login successful!", "success")

    // Redirect based on user type
    setTimeout(() => {
      switch (userType) {
        case "student":
          window.location.href = "student-dashboard.html"
          break
        case "admin":
          window.location.href = "admin-dashboard.html"
          break
        case "superadmin":
          window.location.href = "super-admin-dashboard.html"
          break
      }
    }, 1000)
  }, 2000)
}

function handleSignup(e) {
  e.preventDefault()
  const formData = new FormData(e.target)

  // Validate form
  if (!validateSignupForm(formData)) {
    return
  }

  showLoadingState(e.target)

  setTimeout(() => {
    hideLoadingState(e.target)
    showNotification("Account created successfully!", "success")

    setTimeout(() => {
      window.location.href = "login.html"
    }, 1500)
  }, 2000)
}

// Cart Functions
function addToCart(e) {
  const button = e.target
  const itemCard = button.closest(".menu-item-card")
  const itemName = itemCard.querySelector("h3").textContent
  const itemPrice = Number.parseFloat(itemCard.querySelector(".item-price").textContent.replace("Rs.", ""))
  const itemImage = itemCard.querySelector(".image-placeholder")

  const item = {
    id: Date.now(),
    name: itemName,
    price: itemPrice,
    quantity: 1,
    image: itemImage ? itemImage.style.background : "",
  }

  cart.push(item)
  updateCartDisplay()
  showNotification(`${itemName} added to cart!`, "success")

  // Animate button
  button.style.transform = "scale(0.95)"
  setTimeout(() => {
    button.style.transform = "scale(1)"
  }, 150)
}

function updateCartDisplay() {
  const cartItems = document.querySelector(".cart-items")
  const cartTotal = document.querySelector(".cart-total")

  if (cartItems && cartTotal) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    cartItems.textContent = `${totalItems} items`
    cartTotal.textContent = `Rs.${totalPrice}`
  }
}

// Review Functions
function handleReviewSubmission(e) {
  e.preventDefault()
  const formData = new FormData(e.target)

  const review = {
    foodItem: formData.get("foodItem"),
    rating: formData.get("rating"),
    title: formData.get("reviewTitle"),
    text: formData.get("reviewText"),
    date: new Date().toLocaleDateString(),
    author: currentUser.name,
  }

  if (!review.foodItem || !review.rating || !review.title || !review.text) {
    showNotification("Please fill in all fields", "error")
    return
  }

  showLoadingState(e.target)

  setTimeout(() => {
    hideLoadingState(e.target)
    addReviewToList(review)
    e.target.reset()
    showNotification("Review submitted successfully!", "success")

    // Check for quality alert (if rating is 1 star)
    if (review.rating === "1") {
      checkQualityAlert(review.foodItem)
    }
  }, 1500)
}

function initializeStarRating() {
  const starInputs = document.querySelectorAll('.star-rating input[type="radio"]')
  const starLabels = document.querySelectorAll(".star-rating label")

  starLabels.forEach((label, index) => {
    label.addEventListener("mouseover", () => {
      highlightStars(index)
    })

    label.addEventListener("click", () => {
      selectStars(index)
    })
  })

  const starRating = document.querySelector(".star-rating")
  if (starRating) {
    starRating.addEventListener("mouseleave", resetStarHighlight)
  }
}

// Wallet Functions
function updateWalletDisplay() {
  const balanceElements = document.querySelectorAll(".balance-amount, .wallet-amount")
  balanceElements.forEach((element) => {
    element.textContent = `Rs.${walletBalance.toFixed(2)}`
  })
}

function showAddMoneyModal() {
  const modal = createModal(
    "Add Money to Wallet",
    `
        <form id="addMoneyForm">
            <div class="form-group">
                <label for="amount">Amount</label>
                <input type="number" id="amount" name="amount" min="10" max="5000" placeholder="Enter amount" required>
            </div>
            <div class="form-group">
                <label for="paymentMethod">Payment Method</label>
                <select id="paymentMethod" name="paymentMethod" required>
                    <option value="">Select payment method</option>
                    <option value="esewa/khalti">Esewa/Khalti</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="netbanking">Net Banking</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary btn-full">Add Money</button>
        </form>
    `,
  )

  const form = modal.querySelector("#addMoneyForm")
  form.addEventListener("submit", handleAddMoney)
}

function handleAddMoney(e) {
  e.preventDefault()
  const formData = new FormData(e.target)
  const amount = Number.parseFloat(formData.get("amount"))

  if (amount < 10 || amount > 5000) {
    showNotification("Amount must be between Rs.10 and Rs.5000", "error")
    return
  }

  showLoadingState(e.target)

  setTimeout(() => {
    walletBalance += amount
    updateWalletDisplay()
    hideLoadingState(e.target)
    closeModal()
    showNotification(`Rs.${amount} added to wallet successfully!`, "success")

    // Add transaction to history
    addTransaction(`Wallet Recharge`, amount, "credit")
  }, 2000)
}

// Filter and Search Functions
function initializeFilters() {
  const filterTabs = document.querySelectorAll(".filter-tab")
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      filterTabs.forEach((t) => t.classList.remove("active"))
      // Add active class to clicked tab
      tab.classList.add("active")

      // Filter menu items
      filterMenuItems(tab.textContent)
    })
  })
}

function initializeSearch() {
  const searchInput = document.querySelector(".search-bar input")
  const searchBtn = document.querySelector(".search-btn")

  if (searchInput) {
    searchInput.addEventListener("input", debounce(handleSearch, 300))
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", () => handleSearch())
  }
}

function filterMenuItems(category) {
  const menuItems = document.querySelectorAll(".menu-item-card")

  menuItems.forEach((item) => {
    if (category === "All Items") {
      item.style.display = "block"
    } else {
      // This is a simplified filter - in a real app, you'd have category data
      item.style.display = "block"
    }

    // Add animation
    item.style.opacity = "0"
    item.style.transform = "translateY(20px)"

    setTimeout(() => {
      item.style.opacity = "1"
      item.style.transform = "translateY(0)"
    }, 100)
  })
}

function handleSearch() {
  const searchInput = document.querySelector(".search-bar input")
  const searchTerm = searchInput.value.toLowerCase()
  const menuItems = document.querySelectorAll(".menu-item-card")

  menuItems.forEach((item) => {
    const itemName = item.querySelector("h3").textContent.toLowerCase()
    const itemDescription = item.querySelector(".item-description").textContent.toLowerCase()

    if (itemName.includes(searchTerm) || itemDescription.includes(searchTerm)) {
      item.style.display = "block"
    } else {
      item.style.display = "none"
    }
  })
}

// Admin Functions
function updateOrderStatus(e) {
  const button = e.target
  const orderRow = button.closest(".table-row")
  const orderId = orderRow.querySelector(".order-id").textContent
  const currentStatus = orderRow.querySelector(".status")

  let newStatus = ""
  let newStatusClass = ""

  if (button.textContent.includes("Update")) {
    newStatus = "Ready"
    newStatusClass = "ready"
    button.textContent = "Mark Delivered"
    button.classList.remove("btn-primary")
    button.classList.add("btn-outline")
  } else if (button.textContent.includes("Mark Delivered")) {
    newStatus = "Delivered"
    newStatusClass = "delivered"
    button.textContent = "Complete"
    button.disabled = true
  }

  if (newStatus) {
    currentStatus.textContent = newStatus
    currentStatus.className = `status ${newStatusClass}`
    showNotification(`Order ${orderId} status updated to ${newStatus}`, "success")
  }
}

// Utility Functions
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Close button
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.addEventListener("click", () => {
    removeNotification(notification)
  })

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeNotification(notification)
  }, 5000)
}

function removeNotification(notification) {
  notification.style.transform = "translateX(100%)"
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 300)
}

function showLoadingState(form) {
  const submitBtn = form.querySelector('button[type="submit"]')
  if (submitBtn) {
    submitBtn.disabled = true
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...'
  }
}

function hideLoadingState(form) {
  const submitBtn = form.querySelector('button[type="submit"]')
  if (submitBtn) {
    submitBtn.disabled = false
    submitBtn.innerHTML = submitBtn.getAttribute("data-original-text") || "Submit"
  }
}

function createModal(title, content) {
  const modal = document.createElement("div")
  modal.className = "modal-overlay"
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `

  // Add styles
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `

  const modalContent = modal.querySelector(".modal-content")
  modalContent.style.cssText = `
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    `

  document.body.appendChild(modal)

  // Close functionality
  const closeBtn = modal.querySelector(".modal-close")
  closeBtn.addEventListener("click", () => closeModal())

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  return modal
}

function closeModal() {
  const modal = document.querySelector(".modal-overlay")
  if (modal) {
    modal.remove()
  }
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function animateNumber(element) {
  const target = Number.parseInt(element.textContent.replace(/[^\d]/g, ""))
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }

    if (element.textContent.includes("Rs.")) {
      element.textContent = `Rs.${Math.floor(current).toLocaleString()}`
    } else if (element.textContent.includes("%")) {
      element.textContent = `${Math.floor(current)}%`
    } else {
      element.textContent = Math.floor(current).toLocaleString()
    }
  }, 16)
}

// Additional helper functions for specific features
function validateField(e) {
  const field = e.target
  const value = field.value.trim()

  // Remove existing error
  clearFieldError(e)

  // Validate based on field type
  let isValid = true
  let errorMessage = ""

  switch (field.type) {
    case "email":
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      errorMessage = "Please enter a valid email address"
      break
    case "password":
      isValid = value.length >= 6
      errorMessage = "Password must be at least 6 characters"
      break
    case "tel":
      isValid = /^\d{10}$/.test(value.replace(/\D/g, ""))
      errorMessage = "Please enter a valid 10-digit phone number"
      break
  }

  if (!isValid && value) {
    showFieldError(field, errorMessage)
  }
}

function clearFieldError(e) {
  const field = e.target
  const errorElement = field.parentNode.querySelector(".field-error")
  if (errorElement) {
    errorElement.remove()
  }
  field.style.borderColor = "#e5e7eb"
}

function showFieldError(field, message) {
  const errorElement = document.createElement("span")
  errorElement.className = "field-error"
  errorElement.textContent = message
  errorElement.style.cssText = "color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem;"

  field.style.borderColor = "#ef4444"
  field.parentNode.appendChild(errorElement)
}

function checkPasswordStrength(e) {
  const password = e.target.value
  const strengthIndicator = document.getElementById("password-strength") || createPasswordStrengthIndicator(e.target)

  let strength = 0
  let strengthText = ""
  let strengthColor = ""

  if (password.length >= 6) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  switch (strength) {
    case 0:
    case 1:
      strengthText = "Weak"
      strengthColor = "#ef4444"
      break
    case 2:
      strengthText = "Fair"
      strengthColor = "#f59e0b"
      break
    case 3:
      strengthText = "Good"
      strengthColor = "#10b981"
      break
    case 4:
      strengthText = "Strong"
      strengthColor = "#059669"
      break
  }

  strengthIndicator.textContent = `Password strength: ${strengthText}`
  strengthIndicator.style.color = strengthColor
}

function createPasswordStrengthIndicator(passwordField) {
  const indicator = document.createElement("span")
  indicator.id = "password-strength"
  indicator.style.cssText = "font-size: 0.75rem; margin-top: 0.25rem;"
  passwordField.parentNode.appendChild(indicator)
  return indicator
}

function checkPasswordMatch(e) {
  const confirmPassword = e.target.value
  const password = document.getElementById("password").value
  const matchIndicator = document.getElementById("password-match") || createPasswordMatchIndicator(e.target)

  if (confirmPassword && password) {
    if (confirmPassword === password) {
      matchIndicator.textContent = "Passwords match"
      matchIndicator.style.color = "#10b981"
    } else {
      matchIndicator.textContent = "Passwords do not match"
      matchIndicator.style.color = "#ef4444"
    }
  } else {
    matchIndicator.textContent = ""
  }
}

function createPasswordMatchIndicator(confirmPasswordField) {
  const indicator = document.createElement("span")
  indicator.id = "password-match"
  indicator.style.cssText = "font-size: 0.75rem; margin-top: 0.25rem;"
  confirmPasswordField.parentNode.appendChild(indicator)
  return indicator
}

// Initialize navigation and common features
function initializeNavigation() {
  // Mobile menu toggle (if exists)
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const navLinks = document.querySelector(".nav-links")

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active")
    })
  }
}

function initializeNotifications() {
  // Add notification styles to head if not exists
  if (!document.getElementById("notification-styles")) {
    const styles = document.createElement("style")
    styles.id = "notification-styles"
    styles.textContent = `
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #ffffff;
                border-radius: 50%;
                border-top-color: transparent;
                animation: spin 1s ease-in-out infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .field-error {
                display: block;
            }
        `
    document.head.appendChild(styles)
  }
}

// Placeholder functions for features that would require backend
function loadRecentOrders() {
  // This would typically fetch from an API
  console.log("Loading recent orders...")
}

function loadNotifications() {
  // This would typically fetch from an API
  console.log("Loading notifications...")
}

function loadMenuItems() {
  // This would typically fetch from an API
  console.log("Loading menu items...")
}

function loadReviews() {
  // This would typically fetch from an API
  console.log("Loading reviews...")
}

function addReviewToList(review) {
  // This would typically send to an API and update the UI
  console.log("Adding review:", review)
}

function checkQualityAlert(foodItem) {
  // This would check if 70% of recent reviews are 1-star
  console.log(`Checking quality alert for ${foodItem}`)
  showNotification(`Quality alert sent to administration for ${foodItem}`, "warning")
}

function addTransaction(description, amount, type) {
  // This would typically save to database
  console.log(`Transaction: ${description}, Amount: ${amount}, Type: ${type}`)
}

function validateSignupForm(formData) {
  const password = formData.get("password")
  const confirmPassword = formData.get("confirmPassword")

  if (password !== confirmPassword) {
    showNotification("Passwords do not match", "error")
    return false
  }

  if (password.length < 6) {
    showNotification("Password must be at least 6 characters", "error")
    return false
  }

  return true
}

function highlightStars(index) {
  const stars = document.querySelectorAll(".star-rating label")
  stars.forEach((star, i) => {
    if (i >= index) {
      star.style.filter = "grayscale(0%)"
    } else {
      star.style.filter = "grayscale(100%)"
    }
  })
}

function selectStars(index) {
  const radioInputs = document.querySelectorAll('.star-rating input[type="radio"]')
  if (radioInputs[index]) {
    radioInputs[index].checked = true
  }
}

function resetStarHighlight() {
  const checkedStar = document.querySelector('.star-rating input[type="radio"]:checked')
  if (checkedStar) {
    const checkedIndex = Array.from(document.querySelectorAll('.star-rating input[type="radio"]')).indexOf(checkedStar)
    highlightStars(checkedIndex)
  } else {
    const stars = document.querySelectorAll(".star-rating label")
    stars.forEach((star) => {
      star.style.filter = "grayscale(100%)"
    })
  }
}

function loadOrdersData() {
  console.log("Loading orders data for admin...")
}

function loadMenuManagement() {
  console.log("Loading menu management data...")
}

function loadQualityAlerts() {
  console.log("Loading quality alerts...")
}

function handleAddCollege(e) {
  e.preventDefault()
  const formData = new FormData(e.target)

  showLoadingState(e.target)

  setTimeout(() => {
    hideLoadingState(e.target)
    showNotification("College added successfully!", "success")
    e.target.reset()
  }, 2000)
}

function loadSystemOverview() {
  console.log("Loading system overview...")
}

function loadCollegesData() {
  console.log("Loading colleges data...")
}

function initializeCart() {
  updateCartDisplay()
}
