import { type ComputedRef, computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
    size: {
      type: [String, Number],
      default: '1em',
    },
    color: {
      type: String,
      default: 'currentColor',
    },
    class: {
      type: String,
      default: 'el-icon',
    },
  },
  setup(props) {
    const symbolId: ComputedRef<string> = computed(() => `#icon-${props.icon}`)

    const SvgSize: ComputedRef<string> = computed(() => {
      return typeof props.size === 'string' ? props.size : props.size + 'px'
    })

    return () => (
      <svg
        aria-hidden={true}
        width={SvgSize.value}
        height={SvgSize.value}
        color={props.color}
        fill="currentColor"
        style={{ cursor: 'pointer' }}
        class={props.class}
      >
        <use xlinkHref={symbolId.value}></use>
      </svg>
    )
  },
})
