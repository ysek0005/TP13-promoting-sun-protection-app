<script setup>
import { ref, onMounted } from 'vue'

// Manage user profile information
const user = ref({
  name: '',
  age: '',
  gender: '',
  skinType: ''
})

// Manage registration status (stored in localStorage)
const isRegistered = ref(false)

// Retrieve user data from localStorage (preserve data across refreshes and navigation)
onMounted(() => {
  const storedUser = localStorage.getItem('userProfile')
  const storedStatus = localStorage.getItem('isRegistered')

  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
  if (storedStatus === 'true') {
    isRegistered.value = true
  }
})

// Save user data and registration status to localStorage
const saveUser = () => {
  localStorage.setItem('userProfile', JSON.stringify(user.value))
  localStorage.setItem('isRegistered', 'true') // Store registration status
  isRegistered.value = true
}

// Reset profile (clear localStorage and reset fields)
const resetProfile = () => {
  localStorage.removeItem('userProfile')
  localStorage.removeItem('isRegistered') // Remove registration status
  user.value = { name: '', age: '', gender: '', skinType: '' }
  isRegistered.value = false
}
</script>

<template>
  <div class="user-container">
    <!-- Left section: Display registered user information -->
    <div class="profile-section">
      <div class="profile-content">
        <div class="profile-icon">
          <img src="@/assets/profile-placeholder.png" alt="Profile Icon" />
        </div>
        <!-- Display user information if registered -->
        <div v-if="isRegistered" class="welcome-message">
          <p>Welcome, {{ user.name }}.</p>
          <p>You are {{ user.age }} years old, {{ user.gender }}.</p>
          <p>Your skin type is {{ user.skinType }}.</p>
        </div>
      </div>
    </div>

    <!-- Right section: Form or registration success message -->
    <div class="form-section">
      <div v-if="isRegistered" class="registration-success">
        <h2 class="success-message">Registration Successful!</h2>
        <button @click="resetProfile" class="btn-reset">Set another profile?</button>
      </div>

      <form @submit.prevent="saveUser" v-else>
        <h2 class="form-title">Enter your personal information</h2>

        <div class="input-group">
          <label class="form-label">Name:</label>
          <input v-model="user.name" type="text" class="form-control" required />
        </div>

        <div class="input-group">
          <label class="form-label">Age:</label>
          <input v-model="user.age" type="number" class="form-control" required />
        </div>

        <div class="input-group">
          <label class="form-label">Gender:</label>
          <select v-model="user.gender" class="form-select">
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <!-- Skin Type selection -->
        <div class="input-group">
          <label class="form-label">Skin Type:</label>
          <select v-model="user.skinType" class="form-select">
            <option value="">Select...</option>
            <option value="Fair">Fair</option>
            <option value="Light">Light</option>
            <option value="Medium">Medium</option>
            <option value="Dark">Dark</option>
          </select>
        </div>

        <button type="submit" class="btn-confirm" :disabled="!user.name || !user.age || !user.gender || !user.skinType">
          Confirm
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Layout for the entire screen */
.user-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
}

/* Left section: Profile information */
.profile-section {
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Profile image */
.profile-icon img {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background-color: #ddd;
}

/* Welcome message */
.welcome-message {
  font-size: 22px;
  font-weight: bold;
  color: #007bff;
  margin-top: 20px;
}

/* Right section: Form and Registration Success Message */
.form-section {
  width: 70%;
  background-color: #e6f0ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

/* Registration success message */
.registration-success {
  text-align: center;
}

.success-message {
  font-size: 28px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 20px;
}

/* Common button styles */
.btn-reset,
.btn-confirm {
  padding: 12px;
  font-size: 18px;
  font-weight: bold;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
}

.btn-reset:hover,
.btn-confirm:hover {
  background-color: #0056b3;
}

/* Form title */
.form-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #007bff;
}

/* Input fields */
.input-group {
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
}

.form-control,
.form-select {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Disabled state for the confirm button */
.btn-confirm:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Mobile responsiveness (< 576px) */
@media (max-width: 576px) {
  .user-container {
    flex-direction: column;
  }

  .profile-section {
    width: 100%;
    padding: 20px;
  }

  .form-section {
    width: 100%;
    padding: 20px;
  }

  .profile-icon img {
    width: 150px;
    height: 150px;
  }
}

/* Tablet responsiveness (576px ~ 992px) */
@media (min-width: 576px) and (max-width: 992px) {
  .profile-section {
    width: 40%;
  }

  .form-section {
    width: 60%;
  }
}
</style>
