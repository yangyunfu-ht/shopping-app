import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'AppBreadcrumb',
  setup() {
    const route = useRoute()

    const breadcrumbs = computed(() => route.matched)

    return () => (
      <ElBreadcrumb class={'flex-center'}>
        {breadcrumbs.value.map((breadcrumb) => (
          <ElBreadcrumbItem>{breadcrumb.meta?.title}</ElBreadcrumbItem>
        ))}
      </ElBreadcrumb>
    )
  },
})
