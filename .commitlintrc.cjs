module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // bug修复
        'docs', // 文档更新
        'style', // 代码格式调整
        'refactor', // 代码重构
        'test', // 测试相关
        'chore', // 构建过程或辅助工具变更
        'revert', // 回滚提交
        'perf', // 性能优化
        'ci', // CI配置变更
        'build', // 构建系统或外部依赖变更
      ],
    ],
  },
}
