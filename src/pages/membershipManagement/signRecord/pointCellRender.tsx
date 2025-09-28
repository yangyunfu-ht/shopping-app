import { ElTag } from 'element-plus'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IconCellRender',
  props: {
    params: {
      type: Object,
      default: () => null,
    },
  },
  setup(props) {
    return () => (
      <div>
        <ElTag
          type="success"
          effect="dark"
        >
          +{props.params.data.point}
        </ElTag>
      </div>
    )
  },
})
