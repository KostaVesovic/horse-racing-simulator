<script setup>
defineProps({
  horse: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <li class="item">
    <span class="swatch" :style="{ backgroundColor: horse.hex }" />
    <div class="details">
      <span class="name">{{ horse.name }}</span>
    </div>
    <span class="condition">Condition: {{ horse.condition }}</span>
  </li>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.45rem 0.6rem;
  background: #fafafa;
}

.swatch {
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  flex-shrink: 0;
}

.name {
  font-size: 0.92rem;
  font-weight: 500;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.condition {
  font-size: 0.8rem;
  color: #6b7280;
  justify-self: flex-end;
  margin-left: auto;
}
</style>