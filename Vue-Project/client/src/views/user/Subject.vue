<template>
  <div>
    <Header /> <br /><br /><br /><br /><br/>
    <main class="main">
        <h1 class="text-2xl font-bold mb-4">Danh sách các đề thi</h1>
<div id="subjectList" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <template v-if="subjects.length">
    <RouterLink
      v-for="subject in subjects"
      :key="subject.id"
      :to="`/user/exam/${subject.id}`"
      class="subject-item flex flex-col items-center bg-white rounded-lg shadow-md p-4 transition-transform duration-200 hover:scale-105"
    >
      <img :src="subject.image" :alt="subject.name" class="w-full h-full object-fit rounded-t-lg mb-2" />
      <div class="text-center">
        <h2 class="text-lg font-semibold">{{ subject.name }}</h2>
      </div>
    </RouterLink>
  </template>
  <p v-else class="col-span-full text-center text-gray-500">Không có đề thi cho môn học đã chọn.</p>
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
    </main>
    <Footer />
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();

const currentPage = ref(1);
const ITEMS_PER_PAGE = 3;
const courseId = computed(() => route.params.id);
onMounted(() => {
  store.dispatch("subject/fetchPaginatedSubjects", {
    page: currentPage.value,
    limit: ITEMS_PER_PAGE,
    id:courseId.value
  });
});
const subjects = computed(() => store.state.subject.subjects);
const totalPages = computed(() => store.state.subject.totalPages);

const handlePageChange = (newPage) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    store.dispatch("subject/fetchPaginatedSubjects", {
      page: currentPage.value,
      limit: ITEMS_PER_PAGE,
      id:courseId.value
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
  