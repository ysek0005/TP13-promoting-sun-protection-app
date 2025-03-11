<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="navbar">
    <div class="container">
      <!-- Center: Title -->
      <h1 class="title">UV Guard ☀️</h1>

      <!-- Right: Navigation links -->
      <nav class="nav-links">
        <RouterLink to="/">Profile</RouterLink>
        <RouterLink to="/uvIndex">UV Index</RouterLink>
      </nav>
    </div>
  </header>

  <main class="content">
    <RouterView />
  </main>
</template>

<style scoped>
/* Navigation Bar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

/* Container for the entire navigation */
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
}

/* Title */
.title {
  flex-grow: 1;
  text-align: center;
  color: white;
  font-size: 22px;
  font-weight: bold;
  margin: 0;
}

/* Navigation links */
.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

/* Navigation link styles */
.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  transition: 0.3s;
}

/* Underline for the active link */
.nav-links a.router-link-exact-active {
  border-bottom: 2px solid white;
}

/* Opacity effect on hover */
.nav-links a:hover {
  opacity: 0.8;
}

/* Main content positioning */
.content {
  padding-top: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 80px);
}

/* Mobile responsiveness (< 576px) */
@media (max-width: 576px) {
  .container {
    flex-direction: row;
    /* Arrange elements in a row on mobile */
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }

  .title {
    font-size: 20px;
    text-align: left;
    /* Align text to the left */
    margin-left: 0;
    /* Place title at the left edge */
  }

  .nav-links {
    flex-direction: row;
    gap: 10px;
  }
}

/* Tablet size (≥ 576px & < 768px) */
@media (min-width: 576px) and (max-width: 767px) {
  .container {
    flex-direction: row;
    justify-content: space-between;
  }

  .title {
    font-size: 22px;
    text-align: left;
    margin-left: 0;
  }

  .nav-links {
    flex-direction: row;
    gap: 10px;
  }
}

/* Desktop size (≥ 768px) */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
    justify-content: space-between;
  }

  .title {
    font-size: 22px;
  }

  .nav-links {
    flex-direction: row;
  }
}
</style>
