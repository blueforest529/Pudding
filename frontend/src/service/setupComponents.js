import ToolBar from "../components/common/ToolBar.vue";
import NavDrawer from "../components/common/NavDrawer.vue";

function setupComponents(Vue) {
    Vue.component("tool-bar", ToolBar);
    Vue.component("nav-drawer", NavDrawer);
}

export { setupComponents };