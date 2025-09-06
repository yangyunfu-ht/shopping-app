import { ElButton, ElIcon } from 'element-plus'
import { defineComponent } from 'vue'
import { Tools } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'AppSetting',
  setup() {
    return () => (
      <>
        <ElButton text>
          <ElIcon size={16}>
            <Tools />
          </ElIcon>
        </ElButton>
      </>
    )
  },
})
