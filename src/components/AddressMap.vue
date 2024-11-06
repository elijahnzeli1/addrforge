<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAddressStore } from '@/stores/address';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const addressStore = useAddressStore();
const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
const markers: L.Marker[] = [];

const initMap = () => {
  if (!mapContainer.value) return;

  map = L.map(mapContainer.value).setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  displayAddresses();
};

const displayAddresses = async () => {
  if (!map) return;

  // Clear existing markers
  markers.forEach(marker => marker.remove());
  markers.length = 0;

  for (const address of addressStore.addresses) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          `${address.street}, ${address.city}, ${address.state}, ${address.country}`
        )}`
      );
      const data = await response.json();

      if (data && data[0]) {
        const { lat, lon } = data[0];
        const marker = L.marker([parseFloat(lat), parseFloat(lon)])
          .bindPopup(`
            <strong>${address.street}</strong><br>
            ${address.city}, ${address.state}<br>
            ${address.postalCode}
          `)
          .addTo(map);
        markers.push(marker);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  }

  // Fit bounds if we have markers
  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds());
  }
};

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4">Address Map</h2>
    <div ref="mapContainer" class="h-[400px] rounded-lg"></div>
  </div>
</template>