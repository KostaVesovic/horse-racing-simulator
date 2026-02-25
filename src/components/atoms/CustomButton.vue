<script setup>
defineProps({
	type: {
		type: String,
		default: 'button'
	},
	disabled: {
		type: Boolean,
		default: false
	}
})
</script>

<template>
	<button :type="type" class="custom-button" :disabled="disabled">
		<slot />
	</button>
</template>

<style scoped>
.custom-button {
	border: 1px solid transparent;
	border-radius: 8px;
	padding: 8px 14px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease;
	background: #16a34a;
	color: #ffffff;
}

.custom-button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.custom-button:hover:not(:disabled) {
	background: #15803d;
}
</style>
