import prettier from 'eslint-config-prettier/flat';
import vue from 'eslint-plugin-vue';

import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript';

export default defineConfigWithVueTs(
  vue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    ignores: [
      'node_modules',
      'public',
      'tailwind.config.js',
    ],
  },
  {
    rules: {
      'eol-last': 'off',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/block-lang': 'off', //есть не TS
      '@typescript-eslint/no-unused-vars': 'warn', //всеравно удалятся ненужные
    },
  },
  prettier,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
]
