<template>
    <div>
      <br /><br /><br /><br /><br /><br />
      <div class="container">
        <h1 class="text-3xl font-bold mb-4">Danh sách Khóa học</h1>

<!-- Introduction Section -->
<div class="mb-6">
  <p class="text-lg text-gray-700">
    Chào mừng bạn đến với danh sách các khóa học của chúng tôi. Chúng tôi cung cấp các khóa học luyện thi từ tiểu học đến trung học phổ thông để giúp bạn đạt được thành tích cao trong các kỳ thi.
  </p>
</div>

<!-- Loading State -->
<div v-if="isLoading" class="text-center text-xl">Đang tải...</div>
<div v-if="hasError" class="text-red-500 text-center">{{ errorMessage }}</div>

<!-- Courses Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
  <RouterLink
    v-for="course in courses"
    :key="course.id"
    :to="`/user/subject/${course.id}`"
    class="course-card flex flex-col items-center bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105"
  >
    <img :src="course.image" :alt="course.title" class="course-image w-full h-full object-fit" />
    <div class="p-4 text-center">
      <h2 class="text-lg font-semibold mb-1">{{ course.title }}</h2>
      <p class="text-gray-600">{{ course.name }}</p>
    </div>
  </RouterLink>
</div>
<section class="choose-list" style="margin-top: 100px">
        <div class="flex justify-between p-3 bg-gray-200">
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-700">
          Trang {{ currentPage }} / {{ totalPages }}
        </span>
      </div>
      <div class="flex items-center space-x-1">
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 rounded-l-md"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <div v-for="page in pageButtons" :key="page.key">
          <button
            @click.prevent="handlePageChange(page.number)"
            :class="page.class"
          >
            {{ page.number !== "..." ? page.number : "..." }}
          </button>
        </div>
        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 rounded-r-md"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
      </section>
      
      </div>
    </div>
  </template>
  
  <script setup>
  // CSS styles moved to global stylesheet
  import { ref, computed, watch } from 'vue';
  import { useStore } from 'vuex';
  
  const store = useStore();
  const currentPage = ref(1);
  const coursesPerPage = 3;
  
  const fetchCourses = (page) => {
    store.dispatch('course/fetchPaginatedCourses', { page, limit: coursesPerPage });
  };
  
  const courses = computed(() => store.state.course.course);  // Accessing the `course` array directly from state
const totalPages = computed(() => store.state.course.totalPages); // Accessing `totalPages` directly from state
const isLoading = computed(() => store.state.course.loading); // Accessing `loading` directly from state
const hasError = computed(() => store.state.course.error !== null); // Checks if there's an error
const errorMessage = computed(() => store.state.course.error?.message || ''); 
  watch(currentPage, (newPage) => {
    fetchCourses(newPage);
  });
  
  // Initial fetch of courses
  fetchCourses(currentPage.value);
  
  const handlePageChange = (newPage) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    store.dispatch("subject/fetchPaginatedSubjects", {
      page: currentPage.value,
      limit: ITEMS_PER_PAGE,
      id:subjectId.value
    });
  }
};

const pageButtons = computed(() => {
  const buttons = [];
  const delta = 2;
  console.log(totalPages.value);

  for (let i = 1; i <= totalPages.value; i++) {
    if (
      i === 1 ||
      i === totalPages.value ||
      (i >= currentPage.value - delta && i <= currentPage.value + delta)
    ) {
      buttons.push({
        key: i,
        number: i,
        class:
          currentPage.value === i
            ? "relative inline-flex items-center px-4 py-2 text-sm font-semibold bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0",
      });
    } else if (
      i === currentPage.value - delta - 1 ||
      i === currentPage.value + delta + 1
    ) {
      buttons.push({
        key: i,
        number: "...",
        class:
          "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0",
      });
    }
  }
  return buttons;
});
 
  </script>
  
  <style scoped>
  
  </style>
  