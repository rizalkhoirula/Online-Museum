<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';

import AppMenuItem from './AppMenuItem.vue';

const router = useRouter();

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
    },
    {
        label: 'CRUD',
        items: [
            {
                label: 'User Table',
                icon: 'pi pi-fw pi-table',
                to: '/uikit/table'
            },
            {
                label: 'Product Table',
                icon: 'pi pi-fw pi-pencil',
                to: '/pages/crud'
            }
        ]
    },
    {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Landing',
                icon: 'pi pi-fw pi-globe',
                to: '/'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="i">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
