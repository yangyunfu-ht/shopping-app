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
        {props.params.data.point >= 0 ? (
          <ElTag
            type="success"
            effect="dark"
          >
            +{props.params.data.point}
          </ElTag>
        ) : (
          <ElTag
            type="danger"
            effect="dark"
          >
            {props.params.data.point}
          </ElTag>
        )}
      </div>
    )
  },
})
