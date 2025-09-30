import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'AppBreadcrumb',
  setup() {
    const route = useRoute()

    const breadcrumbs = computed(() =>
      route.matched.filter((el) => el.meta.name)
    )

    return () => (
      <div>
        <ElBreadcrumb
          class={'flex-center'}
          style={{ fontSize: '14px' }}
        >
          {breadcrumbs.value.map((breadcrumb) => (
            <ElBreadcrumbItem>{breadcrumb.meta?.name}</ElBreadcrumbItem>
          ))}
        </ElBreadcrumb>
      </div>
    )
  },
})
