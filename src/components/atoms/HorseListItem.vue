<script setup>
/**
 * Single horse row item shown inside the sidebar list.
 *
 * @props
 * - horse: horse display model (name, hex, condition).
 */
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
  gap: 9.6px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 7.2px 9.6px;
  background: #fafafa;
}

.swatch {
  width: 13.6px;
  height: 13.6px;
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  flex-shrink: 0;
}

.name {
  font-size: 14.72px;
  font-weight: 500;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 1.6px;
}

.condition {
  font-size: 12.8px;
  color: #6b7280;
  justify-self: flex-end;
  margin-left: auto;
}
</style>