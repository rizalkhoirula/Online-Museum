<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const dataviewValue = ref([]);
const layout = ref('grid');
const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);
const sortOptions = ref([
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' }
]);

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/v1/barang/getall');
        dataviewValue.value = response.data;
    } catch (error) {
        console.error('Failed to fetch products:', error);
        // Handle error, e.g., show toast notification
    }
});

const getImageUrlById = (barangId) => {
    if (barangId) {
        return `http://localhost:8080/api/v1/barang/getimage/${barangId}`;
    }
    // Handle case where barangId is not defined or falsy
    return ''; // or return a default image URL or handle error case
};

const onSortChange = (event) => {
    const value = event.value.value;
    const sortValue = event.value;

    if (value.indexOf('!') === 0) {
        sortOrder.value = -1;
        sortField.value = value.substring(1, value.length);
        sortKey.value = sortValue;
    } else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
    }
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>DataView</h5>
                <DataView :value="dataviewValue" :layout="layout" :paginator="true" :rows="9" :sortOrder="sortOrder" :sortField="sortField">
                    <template #header>
                        <div class="grid grid-nogutter">
                            <div class="col-6 text-left">
                                <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort By Price" @change="onSortChange($event)" />
                            </div>
                            <div class="col-6 text-right">
                                <DataViewLayoutOptions v-model="layout" />
                            </div>
                        </div>
                    </template>

                    <template #list="slotProps">
                        <div class="grid grid-nogutter">
                            <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                                <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3" :class="{ 'border-top-1 surface-border': index !== 0 }">
                                    <div class="md:w-10rem relative">
                                        <img class="block xl:block mx-auto border-round w-full" :src="getImageUrlById(item._id)" :alt="item.name" />
                                    </div>
                                    <div class="flex flex-column md:flex-row justify-content-center md:align-items-center flex-1 gap-4">
                                        <div class="flex flex-row md:flex-column justify-content-center align-items-center gap-2 text-center">
                                            <div>
                                                <div class="text-lg font-semibold text-900 mt-2">{{ item.name }}</div>
                                            </div>
                                        </div>
                                        <div class="flex flex-column md:align-items-end gap-5">
                                            <span class="text-xl font-medium text-900 text-center">{{ item.description }}</span>
                                            <div class="flex flex-row-reverse md:flex-row gap-2">
                                                <Button icon="pi pi-heart" outlined></Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #grid="slotProps">
                        <div class="grid grid-nogutter">
                            <div v-for="(item, index) in slotProps.items" :key="index" class="col-12 sm:col-6 md:col-4 p-2">
                                <div class="p-4 border-1 surface-border surface-card border-round flex flex-column">
                                    <div class="surface-50 flex justify-content-center border-round p-3">
                                        <div class="relative mx-auto">
                                            <img class="border-round w-full" :src="getImageUrlById(item._id)" :alt="item.name" style="max-width: 300px" />
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
</template>
