<template>
  <div class="cb-dog">dog {{ name }}</div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    }
  },

  methods: {
    add(a, b) {
      return a + b
    }
  },
}
</script>