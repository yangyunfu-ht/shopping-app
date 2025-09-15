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
        }}
      >
        <div style={{ backgroundColor: '#f5f5f5', height: '100%' }}></div>
      </div>
    )
  },
})
