<template>
  <div class="container mx-auto py-6"> 
      <Banner2 />
    <Banner />
 

    <section class="attend-exam mt-8">
      <h1 class="text-center text-2xl font-bold mb-6">Đề thi tiêu biểu</h1>
      <div id="attendSubject" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="exam in topExams"
          :key="exam.id"
          class="card bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
        >
          <a :href="`/user/contest/${exam.id}`">
            <img
              :src="exam.image"
              class="card-img-top object-cover h-48 w-full"
              :alt="exam.name"
            />
            <div class="card-body p-4">
              <h4 class="text-lg font-semibold">{{ exam.name }}</h4>
              <span class="text-gray-600">Lượt thi: {{ exam.sequence }}</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import Header from '@/components/user/Header.vue';
  import Banner from '@/components/user/Banner.vue';
  import Banner2 from '@/components/user/Bannergv.vue';
  import Footer from '@/components/user/Footer.vue';
  // CSS styles moved to global stylesheet
  const topExams = ref([]);
  
  const fetchExams = async () => {
    try {
      const { buildApiUrl, API_ENDPOINTS } = await import('@/utils/api.js');
      const { data } = await axios.get(buildApiUrl(API_ENDPOINTS.EXAMS));
      topExams.value = data
        .sort((a, b) => b.sequence - a.sequence) // Sắp xếp giảm dần theo sequence
        .slice(0, 6); // Lấy 4 đề thi có lượt thi cao nhất
    } catch (error) {
      console.error('Error fetching exam data:', error);
    }
  };
  
  onMounted(fetchExams);
  
  </script>
  
  <style scoped>
  </style>
  