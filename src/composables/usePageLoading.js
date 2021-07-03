import { ref, onMounted } from '@vue/composition-api'

export const loading = ref(false)

export function startLoading () {
  loading.value = true
}

export function useLoadNotifier () {
  onMounted(() => {
    loading.value = false
  })
}
