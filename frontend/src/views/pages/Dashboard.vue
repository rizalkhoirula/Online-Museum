<script setup>
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const products = ref(null);
const users = ref(null);
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1/' // Sesuaikan dengan URL API Anda
});

// Fetch count of barang (items)
const fetchBarang = async () => {
    try {
        const response = await api.get('/barang/count');
        products.value = response.data.count; // Mengambil jumlah barang
        updateChart(); // Update chart setelah data barang diambil
    } catch (error) {
        console.error('Error fetching barang:', error);
    }
};

// Fetch count of users
const fetchUsers = async () => {
    try {
        const response = await api.get('/auth/count');
        users.value = response.data.count; // Mengambil jumlah pengguna
        updateChart(); // Update chart setelah data pengguna diambil
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

onMounted(() => {
    fetchBarang();
    fetchUsers();
});

let lineChart = null;

const chartRef = ref(null);

const updateChart = () => {
    if (lineChart) {
        lineChart.data.datasets[0].data = [users.value, products.value];
        lineChart.update();
    }
};

const createChart = () => {
    const ctx = chartRef.value.getContext('2d');

    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Users', 'Products'],
            datasets: [
                {
                    label: 'Count',
                    data: [users.value, products.value],
                    backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                    borderColor: ['rgba(54, 162, 235, 1)'],
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

onMounted(() => {
    createChart();
});

const applyLightTheme = () => {

};

const applyDarkTheme = () => {

};

watch(
    () => true,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
</script>

<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Users</span>
                        <div class="text-900 font-medium text-xl">{{ users }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user text-blue-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Products</span>
                        <div class="text-900 font-medium text-xl">{{ products }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-book text-orange-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-8 xl:col-12">
        <div class="card">
            <h5>Line Chart</h5>
            <canvas ref="chartRef"></canvas>
        </div>
    </div>
</template>

<style scoped>
</style>
