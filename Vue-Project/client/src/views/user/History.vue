<template>
    <div class="py-12">
      <div class="container mx-auto px-4">
        <div class="flex space-x-4 mb-8">
          <router-link to="/pages/user/profile">
            <div class="p-4 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">Thông tin cá nhân</div>
          </router-link>
          <router-link to="/pages/user/history">
            <div class="p-4 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">Lịch sử làm bài</div>
          </router-link>
        </div>
  
        <div class="bg-white shadow-md rounded-lg p-6">
          <h1 class="text-2xl font-bold mb-4">Lịch sử làm bài</h1>
          
          <div v-if="examHistory && examHistory.length === 0" class="text-gray-500">
            <p>Không có lịch sử làm bài.</p>
          </div>
          
          <div v-else>
            <div class="flex space-x-4 items-center mb-4">
              <h4 class="text-lg">Sắp xếp theo:</h4>
              <select
                v-model="sortOption.order"
                @change="sortOption.type = 'date'"
                class="px-4 py-2 bg-gray-200 rounded-lg focus:outline-none"
              >
                <option value="asc">Mới nhất</option>
                <option value="desc">Cũ nhất</option>
              </select>
              <select
                v-model="sortOption.order"
                @change="sortOption.type = 'score'"
                class="px-4 py-2 bg-gray-200 rounded-lg focus:outline-none"
              >
                <option value="desc">Cao - Thấp</option>
                <option value="asc">Thấp - Cao</option>
              </select>
            </div>
  
            <div v-if="currentItems.length > 0">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-100 border-b">
                    <th class="py-2 px-4">Mã đề</th>
                    <th class="py-2 px-4">Tên đề</th>
                    <th class="py-2 px-4">Điểm</th>
                    <th class="py-2 px-4">Thời gian</th>
                    <th class="py-2 px-4">Ngày làm</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="history in currentItems"
                    :key="history.id"
                    class="border-b hover:bg-gray-50"
                  >
                    <td class="py-2 px-4">{{ history.idExam }}111</td>
                    <td class="py-2 px-4">
                      <router-link :to="`/user/result/${history.id}`" class="text-blue-600 hover:underline">
                        {{ getExamName(history.idExam) }}
                      </router-link>
                    </td>
                    <td class="py-2 px-4">{{ history.score }}</td>
                    <td class="py-2 px-4">{{ history.time }}</td>
                    <td class="py-2 px-4">{{ new Date(history.date).toLocaleDateString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-else class="text-gray-500">
              <p>Không có dữ liệu lịch sử cho trang hiện tại.</p>
            </div>
  
            <div class="flex space-x-2 mt-4 justify-center">
              <button
                v-for="number in pageNumbers"
                :key="number"
                @click="currentPage = number"
                class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
              >
                {{ number }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  
  const yourProfile = ref(null);
  const examHistory = ref([]);
  const examList = ref([]);
  const currentPage = ref(1);
  const itemsPerPage = ref(5);
  const sortOption = ref({ type: 'date', order: 'asc' });
  
  const idUserLogin = localStorage.getItem('keyLogin');
  
  const fetchData = async () => {
    if (idUserLogin) {
      try {
        console.log("ID Người dùng:", idUserLogin);
        
        const { buildApiUrl, API_ENDPOINTS } = await import('@/utils/api.js');
        
        const userResponse = await axios.get(buildApiUrl(`/accounts/${idUserLogin}`));
        yourProfile.value = userResponse.data;
  
        const historyResponse = await axios.get(buildApiUrl(API_ENDPOINTS.USER_ANSWERS_BY_USER(idUserLogin)));
        examHistory.value = historyResponse.data;
        console.log("Dữ liệu lịch sử:", examHistory.value);
  
        const examResponse = await axios.get(buildApiUrl(API_ENDPOINTS.EXAMS));
        examList.value = examResponse.data;
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
      }
    }
  };
  
  onMounted(fetchData);
  
  const sortedHistory = computed(() => {
    const sorted = [...examHistory.value].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (sortOption.value.type === 'date') {
        return sortOption.value.order === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortOption.value.type === 'score') {
        return sortOption.value.order === 'asc' ? a.score - b.score : b.score - a.score;
      }
      return 0;
    });
    return sorted;
  });
  
  const currentItems = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const items = sortedHistory.value.slice(startIndex, startIndex + itemsPerPage.value);
    console.log("Dữ liệu hiện tại:", items); // Kiểm tra dữ liệu currentItems
    return items;
  });
  
  const pageNumbers = computed(() => {
    return Array.from({ length: Math.ceil(sortedHistory.value.length / itemsPerPage.value) }, (_, i) => i + 1);
  });
  
  const getExamName = (examId) => {
    const exam = examList.value.find((e) => e.id == examId);
    return exam ? exam.name : 'Loading...';
  };
  </script>
  