import {defaultTheme} from "@vuepress/theme-default";
import {path} from "@vuepress/utils";

import type {Theme} from "@vuepress/core";
import type {DefaultThemeOptions} from "@vuepress/theme-default";

import {fileURLToPath} from 'url';
import {dirname} from 'path';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const codingGuideTheme = (options: DefaultThemeOptions): Theme => ({
    name: "coding-guide-theme",

    // we are extending @vuepress/theme-default
    extends: defaultTheme(options),

    layouts: {
        // we override the default layout to provide comment service
        Layout: path.resolve(__dirname, "layouts", "Layout.vue"),
        404: path.resolve(__dirname, "layouts", "404.vue")
    },
});