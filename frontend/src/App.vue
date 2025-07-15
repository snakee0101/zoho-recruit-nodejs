<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="layout">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="80" height="80" />
      <nav>
        <RouterLink to="/" exact>Form</RouterLink>
        <RouterLink to="/list">Submitted forms</RouterLink>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 220px;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  margin-bottom: 2rem;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

nav a {
  padding: 0.75rem 1rem;
  text-align: left;
  color: #333;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s;
}

nav a.router-link-exact-active {
  background-color: #e0e0e0;
  font-weight: bold;
}

nav a:hover {
  background-color: #f0f0f0;
}

.main-content {
  flex: 1;
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>
