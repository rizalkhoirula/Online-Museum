<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const toast = useToast();
const product = ref({
    name: '',
    description: '',
    imageFile: null, // Store the image file here
    imageUrl: '' // This will be used to display the preview
});
const products = ref([]);
const newproductDialog = ref(false);
const editproductDialog = ref(false);
const deleteProductDialog = ref(false);
const selectedProducts = ref(null);
const filters = ref({});
const submitted = ref(false);
let selectedFile = null;

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/v1/barang/getall');
        products.value = response.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch products', life: 3000 });
    }
});

const getImageUrlById = (barangId) => {
    return `http://localhost:8080/api/v1/barang/getimage/${barangId}`;
};

const openNew = () => {
    product.value = {};
    submitted.value = false;
    newproductDialog.value = true;
};

const hideDialog = () => {
    newproductDialog.value = false;
    editproductDialog.value = false;
    submitted.value = false;
};

const editProduct = (editProductData) => {
    product.value = { ...editProductData };
    editproductDialog.value = true;
};
const saveEditedProduct = async () => {
    submitted.value = true;

    if (!product.value.name) {
        console.error('Name is required');
        return;
    }
    if (!product.value.description) {
        console.error('Description is required');
        return;
    }
    if (!product.value.imageFile) {
        console.error('Image is required');
        return;
    }

    console.log('Submitting product:', product.value);

    const formData = new FormData();
    formData.append('name', product.value.name);
    formData.append('description', product.value.description);
    formData.append('image', product.value.imageFile); // The key should match the backend's expectation

    try {
        const productId = product.value._id;
        const response = await axios.put(`http://localhost:8080/api/v1/barang/${productId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('Product added successfully:', response.data);
        newproductDialog.value = false;
        resetForm();
        setTimeout(() => {
            location.reload();
        }, 1000);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Product update', life: 1000 });
    } catch (error) {
        console.error('Error adding product:', error);
    }
};

const confirmDeleteProduct = (editProduct) => {
    product.value = editProduct;
    deleteProductDialog.value = true;
};

const deleteProduct = async () => {
    try {
        const productId = product.value._id;
        await axios.delete(`http://localhost:8080/api/v1/barang/${productId}`);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 1000 });
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product', life: 3000 });
        console.error(error);
    } finally {
        deleteProductDialog.value = false;
        product.value = {};
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null }
    };
};
const onSelect = (event) => {
    const file = event.files[0];
    product.value.imageFile = file;

    // Create a URL for the image to preview it
    const reader = new FileReader();
    reader.onload = (e) => {
        product.value.imageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
};

const onBeforeUpload = async (event) => {
    event.options.clear(); // clear the files from the file input
};

const saveProduct = async () => {
    submitted.value = true;

    if (!product.value.name) {
        console.error('Name is required');
        return;
    }
    if (!product.value.description) {
        console.error('Description is required');
        return;
    }
    if (!product.value.imageFile) {
        console.error('Image is required');
        return;
    }

    console.log('Submitting product:', product.value);

    const formData = new FormData();
    formData.append('name', product.value.name);
    formData.append('description', product.value.description);
    formData.append('image', product.value.imageFile); // The key should match the backend's expectation

    try {
        const response = await axios.post('http://localhost:8080/api/v1/barang/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Product added successfully:', response.data);
        newproductDialog.value = false;
        resetForm();
    } catch (error) {
        console.error('Error adding product:', error);
    }
};

const resetForm = () => {
    product.value.name = '';
    product.value.description = '';
    product.value.imageFile = null;
    product.value.imageUrl = '';
    submitted.value = false;
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                    </template>
                </Toolbar>

                <DataTable
                    :value="products"
                    v-model:selection="selectedProducts"
                    dataKey="_id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Products</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
                            </IconField>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="name" header="Name" :sortable="true" headerStyle="width:14%; min-width:10rem;"></Column>
                    <Column header="Image" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Image</span>
                            <img :src="getImageUrlById(slotProps.data._id)" :alt="slotProps.data.name" class="shadow-2" width="100" />
                        </template>
                    </Column>
                    <Column field="description" header="Description" :sortable="true" headerStyle="width:14%; min-width:8rem;"></Column>
                    <Column field="createdAt" header="Created At" :sortable="true" headerStyle="width:14%; min-width:10rem;"></Column>
                    <Column field="updatedAt" header="Updated At" :sortable="true" headerStyle="width:14%; min-width:10rem;"></Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="newproductDialog" :style="{ width: '450px' }" header="Add Product Details" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="product.name" required autofocus :invalid="submitted && !product.name" />
                        <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="product.description" required rows="3" cols="20" />
                    </div>
                    <div class="field">
                        <label for="image">Image</label>
                        <FileUpload name="demo[]" @before-upload="onBeforeUpload" @select="onSelect" :multiple="false" accept="image/*" :maxFileSize="1000000" customUpload />
                        <img :src="product.imageUrl" v-if="product.imageUrl" alt="Product Image" class="mt-3" style="max-width: 100%" />
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" text @click="saveProduct" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="editproductDialog" :style="{ width: '450px' }" header="Product Details" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="product.name" required autofocus :invalid="submitted && !product.name" />
                        <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="product.description" required rows="3" cols="20" />
                    </div>
                    <div class="field">
                        <label for="image">Image</label>
                        <FileUpload name="demo[]" @before-upload="onBeforeUpload" @select="onSelect" :multiple="false" accept="image/*" :maxFileSize="1000000" customUpload />
                        <img :src="product.imageUrl" v-if="product.imageUrl" alt="Product Image" class="mt-3" style="max-width: 100%" />
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" text @click="saveEditedProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product"
                            >Are you sure you want to delete <b>{{ product.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteProduct" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
