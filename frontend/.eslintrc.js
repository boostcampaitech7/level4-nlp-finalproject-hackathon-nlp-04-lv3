module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // JSX 파싱 활성화
    },
  },
  // ESLint가 확장해서 사용할 규칙 세트
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    // Prettier와 충돌하지 않도록 설정
    'plugin:prettier/recommended',
    'prettier',
  ],
  // 사용하고자 하는 ESLint 플러그인
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  // ESLint 규칙 커스터마이징
  rules: {
    // Prettier 포맷 관련 규칙 - 반드시 "error" 또는 "warn"으로 설정해야 제대로 적용됨
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],

    // TypeScript 관련 규칙
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off', // 필요하다면 "warn"/"error"로 조정

    // React Hooks 규칙
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // React 17 이상에서 JSX를 사용할 때 React import 여부 무시
    'react/react-in-jsx-scope': 'off',

    // import 정렬, unused import, 등 추가 가능
    // "import/order": ["warn", { ... }]
    // "no-unused-vars": "off", // TS에서 처리하도록
    // "@typescript-eslint/no-unused-vars": ["warn"],
  },
  // React 버전을 자동으로 감지하도록
  settings: {
    react: {
      version: '18.3.1',
    },
  },
}
