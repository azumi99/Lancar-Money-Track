import { createConfig } from '@gluestack-ui/themed';
import { config as defaultConfig } from '@gluestack-ui/config';

const config = createConfig({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    fonts: {
      ...defaultConfig.tokens.fonts,
      body: 'Poppins-Regular',
    },
  },
});

export { config };
