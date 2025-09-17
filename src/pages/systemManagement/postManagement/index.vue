<template>
  <div style="height: 100%; overflow: auto">
    <div
      style="height: 200px; background-color: aqua; margin-bottom: 20px"
      v-for="item in 20"
      :key="item"
    ></div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
