<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'vue-chartjs';
import { useAddressStore } from '@/stores/address';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const addressStore = useAddressStore();
const addressStats = ref({
  cityCounts: {},
  stateDistribution: {},
  addressDensity: []
});

const chartData = ref({
  labels: [],
  datasets: [{
    label: 'Addresses per City',
    data: [],
    backgroundColor: 'rgba(75, 192, 192, 0.5)'
  }]
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Address Distribution by City'
    }
  }
};

const analyzeAddresses = () => {
  const cities = {};
  const states = {};

  addressStore.addresses.forEach(address => {
    cities[address.city] = (cities[address.city] || 0) + 1;
    states[address.state] = (states[address.state] || 0) + 1;
  });

  addressStats.value = {
    cityCounts: cities,
    stateDistribution: states,
    addressDensity: calculateAddressDensity()
  };

  updateChartData();
};

const calculateAddressDensity = () => {
  // Simple density calculation based on postal codes
  const postalCodeGroups = {};
  addressStore.addresses.forEach(address => {
    const postalPrefix = address.postalCode.substring(0, 3);
    postalCodeGroups[postalPrefix] = (postalCodeGroups[postalPrefix] || 0) + 1;
  });
  
  return Object.entries(postalCodeGroups)
    .map(([prefix, count]) => ({
      prefix,
      density: count as number
    }))
    .sort((a, b) => b.density - a.density);
};

const updateChartData = () => {
  const cities = Object.keys(addressStats.value.cityCounts);
  const counts = cities.map(city => addressStats.value.cityCounts[city]);

  chartData.value = {
    labels: cities,
    datasets: [{
      label: 'Addresses per City',
      data: counts,
      backgroundColor: 'rgba(75, 192, 192, 0.5)'
    }]
  };
};

onMounted(() => {
  analyzeAddresses();
});
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4">Address Analytics</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-3">City Distribution</h3>
        <Bar :data="chartData" :options="chartOptions" class="h-64" />
      </div>

      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-3">High-Density Areas</h3>
        <ul class="space-y-2">
          <li v-for="(area, index) in addressStats.addressDensity.slice(0, 5)" :key="index"
              class="flex justify-between items-center">
            <span class="font-medium">Postal Area {{ area.prefix }}</span>
            <span class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
              {{ area.density }} addresses
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>