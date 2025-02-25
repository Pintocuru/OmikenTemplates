// [packages] tailwind.config.js
import parentConfig from '../../tailwind.config.js';

export default {
 ...parentConfig, // 親の設定を展開
 content: ['./src/**/*.{html,js,vue}']
};
