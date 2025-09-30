import { useImageViewer } from '@/hooks/useImageViewer'
import { ElImage } from 'element-plus'
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
    const handleClick = () => {
      if (props.params.data.logo) {
        useImageViewer({
          urlList: [props.params.data.logo],
          initialIndex: 0,
          zIndex: 99999,
        })
      }
    }

    return () => (
      <div>
        <span
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        >
          {props.params.data.logo ? (
            <ElImage
              style="width: 30px; height: 30px"
              src={props.params.data.logo}
              fit={'fill'}
            />
          ) : null}
        </span>
      </div>
    )
  },
})
