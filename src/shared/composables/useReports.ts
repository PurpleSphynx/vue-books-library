import { ref } from 'vue'
import { useReportsApi } from '@/shared/api/useReportsApi'
import { mockTop } from '@/shared/mock/data'
import type { TopAuthor } from '@/shared/types'

export function useReports() {
  const items = ref<TopAuthor[]>([])
  const loading = ref(false)
  const api = useReportsApi()
  async function getTopAuthors(year: number) {
    loading.value = true
    try {
      items.value =
        import.meta.env.VITE_USE_MOCK !== 'false' ? mockTop : (await api.getTopAuthors(year)).items
    } finally {
      loading.value = false
    }
  }

  return { items, loading, getTopAuthors }
}
