import { ElImage } from 'element-plus'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div
        style={{
          width: props.collapse ? '64px' : '210px',
          height: '56px',
          boxSizing: 'border-box',
          transition: 'var(--el-transition-all)',
          backgroundColor: 'var(--el-menu-bg-color)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ElImage
          src="https://element-plus.org/images/element-plus-logo.svg"
          style={{ height: '40px', width: '192px' }}
        />
      </div>
    )
  },
})
