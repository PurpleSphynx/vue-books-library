import { ref } from 'vue'
import { getTopAuthors } from './reports-api'
import type { TopAuthor } from '@/shared/types'

export function useTopAuthors() {
  const items = ref<TopAuthor[]>([])
  const loading = ref(false)

  async function fetchTopAuthors(year: number) {
    loading.value = true
    try {
      items.value = (await getTopAuthors(year)).items
    } finally {
      loading.value = false
    }
  }

  return { items, loading, fetchTopAuthors }
}
