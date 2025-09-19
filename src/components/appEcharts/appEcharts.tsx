import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'AppEcharts',
  props: {
    options: {
      type: Object,
      required: true,
    },
    height: {
      type: String,
      default: '100%',
    },
    width: {
      type: String,
      default: '100%',
    },
  },
  setup(props) {
    const chartRef = ref<HTMLElement | null>(null)
    let chartInstance: echarts.ECharts | null = null

    const initChart = () => {
      if (chartRef.value) {
        chartInstance = echarts.init(chartRef.value)
        chartInstance.setOption(props.options)
      }
    }

    const resizeChart = () => {
      if (chartInstance) {
        chartInstance.resize()
      }
    }

    onMounted(() => {
      initChart()
      window.addEventListener('resize', resizeChart)
    })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
      }
      window.removeEventListener('resize', resizeChart)
    })

    watch(
      () => props.options,
      (newOptions) => {
        if (chartInstance) {
          chartInstance.setOption(newOptions, true)
        }
      },
      { deep: true }
    )

    return () => (
      <div
        ref={chartRef}
        style={{ width: props.width, height: props.height }}
      ></div>
    )
  },
})
