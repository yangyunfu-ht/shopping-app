import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import legacy from '@vitejs/plugin-legacy'
import postcssPresetEnv from 'postcss-preset-env'
import autoprefixer from 'autoprefixer'
import gapProperties from 'postcss-gap-properties'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(), // 自动导入 Vue API，如 ref, reactive, toRefs 等
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    // 自动导入 Element Plus 组件
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
    }),
    legacy({
      // 传统浏览器兼容插件
      targets: [
        'defaults',
        'not IE 11',
        'chrome >= 60',
        'last 2 versions',
        '> 0.2%',
        'Firefox ESR',
        'not dead',
      ],
      polyfills: true, // 启用 polyfills
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      modernPolyfills: true, // 按需注入现代特性 Polyfill
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '#': resolve(__dirname, 'types'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element.scss" as *;`,
      },
    },
    postcss: {
      plugins: [
        gapProperties(),
        postcssPresetEnv({
          // 专门针对 Chrome 90 及更低版本
          browsers: ['chrome >= 60', 'last 2 versions'],
          features: {
            'custom-properties': false, // 禁用自定义属性转换
            'nesting-rules': true, // 启用嵌套规则
          },
          autoprefixer: {
            flexbox: 'no-2009',
            grid: 'autoplace', // 启用grid前缀
            overrideBrowserslist: ['chrome >= 60', 'last 2 versions'],
          },
        }),
        autoprefixer({
          // 单独配置autoprefixer
          overrideBrowserslist: ['chrome >= 60', 'last 2 versions'],
          grid: 'autoplace',
        }),
      ],
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    modulePreload: {
      polyfill: true,
    },
    emptyOutDir: true,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
      },
      output: {
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.originalFileNames?.includes('.css')) {
            return 'css/[name].[hash].css'
          }
          return 'assets/[name].[hash].[ext]'
        },
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendors'
          }
        },
      },
    },
  },
})
