<script setup>
import { ref, onBeforeMount, reactive, computed } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import axios from 'axios';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const customers = ref([]);
const rawFilters = reactive({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    createdAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    updatedAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    image: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
});
const loading = ref(true);

const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/v1/auth/user');
        customers.value = response.data;
        loading.value = false;
    } catch (error) {
        console.error('Error fetching customers:', error);
        loading.value = false;
    }
};

onBeforeMount(() => {
    fetchData();
});

const filters = computed(() => rawFilters);

const clearFilters = () => {
    Object.keys(rawFilters).forEach((key) => {
        if (Array.isArray(rawFilters[key].value)) {
            rawFilters[key].value = [];
        } else {
            rawFilters[key].value = null;
        }
    });
};

const formatDate = (value) => {
    return new Date(value).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// const editItem = (id) => {
//     console.log(`Edit item with id: ${id}`);
// };

// const deleteItem = (id) => {
//     console.log(`Delete item with id: ${id}`);
// };

// const getImageUrlById = (barangId) => {
//     return `http://localhost:8080/api/v1/barang/getimage/${barangId}`;
// };
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Filter Menu</h5>
                <DataTable
                    :value="customers"
                    :paginator="true"
                    :rows="10"
                    dataKey="_id"
                    :rowHover="true"
                    filterDisplay="menu"
                    :loading="loading"
                    :filters="filters"
                    :globalFilterFields="['username', 'Email', 'Role', 'createdAt', 'updatedAt']"
                    showGridlines
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilters" />
                            <div class="p-input-icon-left">
                                <InputText v-model="rawFilters.global.value" placeholder="Keyword Search" style="width: 100%" />
                            </div>
                        </div>
                    </template>
                    <template #empty> No customers found. </template>
                    <template #loading> Loading customers data. Please wait. </template>
                    <Column field="no" header="No" style="min-width: 6rem">
                        <template #body="{ data }">
                            {{ customers.indexOf(data) + 1 }}
                        </template>
                    </Column>
                    <Column field="username" header="username" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.username }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by Name" />
                        </template>
                    </Column>
                    <Column field="email" header="email" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.email }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by Description" />
                        </template>
                    </Column>
                    <Column field="Role" header="Role" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.role }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by Description" />
                        </template>
                    </Column>
                    <Column field="createdAt" header="Created At" dataType="date">
                        <template #body="{ data }">
                            {{ formatDate(data.createdAt) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                        </template>
                    </Column>
                    <Column field="updatedAt" header="Updated At" dataType="date">
                        <template #body="{ data }">
                            {{ formatDate(data.updatedAt) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
/* Add your scoped styles here */
</style>
