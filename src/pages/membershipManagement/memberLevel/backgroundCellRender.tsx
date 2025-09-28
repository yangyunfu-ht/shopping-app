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
      if (props.params.data.backgroundUrl) {
        useImageViewer({
          urlList: [props.params.data.backgroundUrl],
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
          {props.params.data.backgroundUrl ? (
            <ElImage
              style="width: 30px; height: 30px"
              src={props.params.data.backgroundUrl}
              fit={'fill'}
            />
          ) : null}
        </span>
      </div>
    )
  },
})
