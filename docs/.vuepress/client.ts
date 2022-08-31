import { defineClientConfig } from "@vuepress/client";
import Layout from "./layouts/Layout.vue";
import NotFound from "./layouts/NotFound.vue";

export default defineClientConfig({
    layouts: {
        // we override the default layout to provide comment service
        Layout,
        NotFound,
    },
});