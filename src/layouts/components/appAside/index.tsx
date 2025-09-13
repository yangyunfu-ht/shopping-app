import { computed, defineComponent } from 'vue'
import normalAside from './normalAside.vue'
import drawerAside from './drawerAside.vue'
import { screenSize } from '@/utils/enum'

export default defineComponent({
  name: 'AppAside',
  components: {
    normalAside,
    drawerAside,
  },
  props: {
    appWidth: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const isNormal = computed(() => props.appWidth > screenSize.small)
    return () => <>{isNormal.value ? <normalAside /> : <drawerAside />}</>
  },
})
