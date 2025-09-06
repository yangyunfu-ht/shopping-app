import { ElEmpty } from 'element-plus'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RowsEmpty',
  props: {
    description: {
      type: String,
      default: '暂无数据',
    },
    imageSize: {
      type: Number,
      default: 120,
    },
  },
  setup(props) {
    return () => (
      <ElEmpty
        description={props.description}
        imageSize={props.imageSize}
      />
    )
  },
})
