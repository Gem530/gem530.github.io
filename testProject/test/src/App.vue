<script setup>
import { ref, watch } from 'vue'
import { ElInputNumber } from 'element-plus'
import { signal, computed, effect } from 'alien-signals'
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'

const test = ref()
const count = signal(0)
watch(() => test.value, (val, old) => {
  // count.set(val)
  console.log('new', val, test.value, 'old', old, 'count', count.get())
})
const getTest = () => {
  console.log(test.value)
}
</script>

<template>
  {{ test }}
  <ElInputNumber v-model="count"></ElInputNumber>
  <button @click="getTest">test</button>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />


    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main> -->
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
