<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="navbar">
    <div class="container">
      <!-- Center: Title -->
      <h1 class="title"> UV Guard ☀️</h1>

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
/* Navigation bar styles */
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

/* Layout for navigation container */
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
}

/* Title styling (perfectly centered) */
.title {
  flex-grow: 1;
  text-align: center;
  color: white;
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  margin-left: 200px;
  /* Adjust the value as needed */
}

/* Navigation link styles */
.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  transition: 0.3s;
}

.nav-links a.router-link-exact-active {
  border-bottom: 2px solid white;
}

.nav-links a:hover {
  opacity: 0.8;
}

/* Adjust layout for main content */
.content {
  padding-top: 80px;
  /* Creates space below the fixed header */
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 80px);
}
</style>
