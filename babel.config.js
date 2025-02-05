module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    'module:metro-react-native-babel-preset',
    '@babel/preset-typescript',
  ],
  overrides: [
    {
      plugins: [
        [
          '@babel/plugin-transform-private-methods',
          {
            loose: true,
          },
        ],
      ],
    },
  ],

  plugins: [
    'react-native-reanimated/plugin',
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }],

    [
      'module-resolver',
      {
        root: ['src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.json',
          'png',
          'svg',
          'jpg',
        ],
        alias: {
          tests: ['./__tests__/'],
          '@components': './src/components',
          '@redux': './src/redux',
          '@services': './src/services',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@config': './src/config',
          '@hooks': './src/hooks',
          '@assets': './src/assets',
          '@testing': './src/tests',
          '@utils': './src/utils',
          '@modules': './src/modules',
          '@globalServices': './src/globalService',
          '@splashscreen': './src/splashscreen',
        },
      },
    ],
  ],
};
