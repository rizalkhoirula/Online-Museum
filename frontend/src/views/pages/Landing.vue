<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { ProductService } from '@/service/ProductService';
import { PhotoService } from '@/service/PhotoService';
import { ref, onMounted } from 'vue';

import axios from 'axios';

const dataviewValue = ref([]);
const layout = ref('grid');
const sortOrder = ref(null);
const sortField = ref(null);

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/v1/barang/getall');
        dataviewValue.value = response.data;
    } catch (error) {
        console.error('Failed to fetch products:', error);
    }
});

const getImageUrlById = (barangId) => {
    if (barangId) {
        return `http://localhost:8080/api/v1/barang/getimage/${barangId}`;
    }
    return '';
};

const products = ref([]);
const images = ref([]);
const galleriaResponsiveOptions = ref([
    { breakpoint: '1920px', numVisible: 5 },
    { breakpoint: '1280px', numVisible: 4 },
    { breakpoint: '960px', numVisible: 3 },
    { breakpoint: '600px', numVisible: 2 },
    { breakpoint: '480px', numVisible: 1 }
]);

const productService = new ProductService();
const photoService = new PhotoService();

onMounted(() => {
    productService.getProductsSmall().then((data) => (products.value = data));
    photoService.getImages().then((data) => (images.value = data));
});
const { layoutConfig } = useLayout();
const smoothScroll = (id) => {
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
};

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

onMounted(() => {
    productService.getProductsSmall().then((data) => (products.value = data));
    photoService.getImages().then((data) => (images.value = data));
});
</script>

<template>
    <div class="surface-0 flex justify-content-center">
        <div id="home" class="landing-wrapper overflow-hidden">
            <div class="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static mb-3">
                <a class="flex align-items-center" href="#"> <img :src="logoUrl" alt="Sakai Logo" height="50" class="mr-0 lg:mr-2" /><span class="text-900 font-medium text-2xl line-height-3 mr-8">SAKAI</span> </a>
                <a class="cursor-pointer block lg:hidden text-700 p-ripple" v-ripple v-styleclass="{ selector: '@next', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }">
                    <i class="pi pi-bars text-4xl"></i>
                </a>
                <div class="align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2" style="top: 120px">
                    <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                        <li>
                            <a @click="smoothScroll('#hero')" class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                <span>Home</span>
                            </a>
                        </li>
                        <li>
                            <a @click="smoothScroll('#galleria')" class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                <span>Overview</span>
                            </a>
                        </li>
                        <li>
                            <a @click="smoothScroll('#gallery')" class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                <span>Gallery</span>
                            </a>
                        </li>
                        <li>
                            <a @click="smoothScroll('#about')" class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                <span>about</span>
                            </a>
                        </li>
                    </ul>
                    <div class="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                        <a href="/auth/login"><Button label="Login" class="p-button-text p-button-rounded border-none font-light line-height-2 text-blue-500"></Button></a>
                        <a href="/auth/register"><Button label="Register" class="p-button-rounded border-none ml-5 font-light text-white line-height-2 bg-blue-500"></Button></a>
                    </div>
                </div>
            </div>

            <div
                id="hero"
                class="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
            >
                <div class="mx-4 md:mx-8 mt-0 md:mt-4">
                    <h1 class="text-6xl font-bold text-gray-900 line-height-2"><span class="font-light block">欢迎来到</span>网上中国博物馆</h1>
                    <p class="font-normal text-2xl line-height-3 md:mt-3 text-gray-700">
                        欢迎通过本网站享受身临其境的视觉体验，在这里您会发现中国领先博物馆的令人惊叹的虚拟画廊。从古典艺术到建筑奇观，每幅图像不仅捕捉到了历史和文化之美，还邀请您反思艺术遗产的无价丰富。探索每张照片背后的故事，探索丰富的收藏，并将中国之美直接带到您的屏幕上。
                    </p>

                    <Button label="我们走吧!" class="p-button-rounded text-xl border-none mt-5 bg-blue-500 font-normal text-white line-height-3 px-3" @click="smoothScroll('#galleria')"></Button>
                </div>
                <div class="flex justify-content-center md:justify-content-end">
                    <img src="/demo/images/landing/pk.png" alt="Hero Image" class="w-9 md:w-auto" style="margin-left: auto" />
                </div>
            </div>
            <div id="galleria" class="py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
                <div class="col-30">
                    <div class="card">
                        <center><h2>画廊</h2></center>
                        <Galleria :value="images" :responsiveOptions="galleriaResponsiveOptions" :numVisible="4" :circular="true" containerStyle="max-width: 700px; margin: auto">
                            <template #item="slotProps">
                                <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block" />
                            </template>
                            <template #thumbnail="slotProps">
                                <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block" />
                            </template>
                        </Galleria>
                    </div>
                </div>
            </div>
            <div id="gallery" class="py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
                <div class="grid">
                    <div class="col-12">
                        <div class="card">
                            <center><h2>照片库</h2></center>
                            <DataView :value="dataviewValue" :layout="layout" :paginator="true" :rows="9" :sortOrder="sortOrder" :sortField="sortField">
                                <template #grid="slotProps">
                                    <div class="grid grid-nogutter">
                                        <div v-for="(item, index) in slotProps.items" :key="index" class="col-12 sm:col-6 md:col-4 p-2">
                                            <div class="p-4 border-1 surface-border surface-card border-round flex flex-column">
                                                <div class="surface-50 flex justify-content-center border-round p-3">
                                                    <div class="relative mx-auto">
                                                        <img class="border-round" :src="getImageUrlById(item._id)" :alt="item.name" style="width: 100%; height: 300px; object-fit: cover" />
                                                    </div>
                                                </div>
                                                <div class="pt-4">
                                                    <div class="flex flex-row justify-content-center align-items-center gap-2 text-center">
                                                        <div>
                                                            <div class="text-lg font-semibold text-900 mt-1">{{ item.name }}</div>
                                                        </div>
                                                    </div>
                                                    <div class="flex flex-column gap-4 mt-4">
                                                        <span class="text-center">{{ item.description }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </DataView>
                        </div>
                    </div>
                </div>
            </div>

            <div id="about" class="py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
                <div class="text-center">
                    <h2 class="text-900 font-normal mb-2">随处可见的强大力量</h2>
                    <span class="text-600 text-2xl">一站式在线博物馆体验....</span>
                </div>

                <div class="grid mt-8 pb-2 md:pb-8">
                    <div class="flex justify-content-center col-12 lg:col-6 bg-pink-100 p-0 flex-order-1 lg:flex-order-0" style="border-radius: 10px">
                        <img src="/demo/images/landing/wo.png" class="w-11" alt="mockup mobile" style="height: 600px; width: 500px" />
                    </div>

                    <div class="col-12 lg:col-6 my-auto flex flex-column lg:align-items-end text-center lg:text-right">
                        <div class="flex align-items-center justify-content-center bg-pink-200 align-self-center lg:align-self-end" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                            <i class="pi pi-fw pi-mobile text-5xl text-pink-700"></i>
                        </div>
                        <h2 class="line-height-1 text-900 text-4xl font-normal">便捷的移动体验</h2>
                        <span class="text-700 text-2xl line-height-3 ml-0 md:ml-2" style="max-width: 650px"
                            >您可以随时随地通过移动设备访问我们的博物馆，享受无缝的在线体验。通过我们的应用程序，探索丰富的历史文物和艺术作品，随时获取最新的展览信息。</span
                        >
                    </div>
                </div>

                <div class="grid my-8 pt-2 md:pt-8">
                    <div class="col-12 lg:col-6 my-auto flex flex-column text-center lg:text-left lg:align-items-start">
                        <div class="flex align-items-center justify-content-center bg-yellow-200 align-self-center lg:align-self-start" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                            <i class="pi pi-fw pi-desktop text-5xl text-yellow-700"></i>
                        </div>
                        <h2 class="line-height-1 text-900 text-4xl font-normal">丰富的桌面体验</h2>
                        <span class="text-700 text-2xl line-height-3 mr-0 md:mr-2" style="max-width: 650px">通过我们的桌面网站，您可以深入探索博物馆的所有角落。高分辨率图像、详细的描述和互动式展览，让您如同身临其境。</span>
                    </div>

                    <div class="flex justify-content-end flex-order-1 sm:flex-order-2 col-12 lg:col-6 bg-yellow-100 p-0" style="border-radius: 8px">
                        <img src="/demo/images/landing/mockup-desktop.svg" class="w-11" alt="mockup" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>

</style>
