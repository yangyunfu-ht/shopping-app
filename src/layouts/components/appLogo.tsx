import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppLogo',
  setup() {
    return () => (
      <div
        style={{
          padding: '8px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ backgroundColor: '#f5f5f5', height: '100%' }}></div>
      </div>
    )
  },
})
