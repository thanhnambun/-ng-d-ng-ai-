<template>
  <div class="admin-exam-list bg-gray-100 p-6">
    <div class="flex justify-between p-3 bg-slate-400">
      <h2 class="text-xl font-semibold mb-4">Danh sách bài thi</h2>
      <div class="w-3/5 flex justify-center">
        <label class="text-2xl p-3" for="search">
          <SearchOutlined />
        </label>
        <input
          type="text"
          name="search"
          v-model="searchQuery"
          class="w-2/3 h-12 border-black border-[1px] p-3"
          placeholder="Tìm kiếm"
        />
      </div>
      <button
        @click="openAddExamModal()"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Thêm bài thi
      </button>
    </div>

    <ExamModal />

    <div class="overflow-x-auto">
      <div class="min-w-full bg-white">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th
                @click="toggleSort('id')"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
              >
                ID
                <span v-if="sortField === 'id'">
                  <CaretUpOutlined
                    v-if="sortDirection === 'asc'"
                    class="ml-1"
                  />
                  <CaretDownOutlined v-else class="ml-1" />
                </span>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
              >
                Ảnh
                <span v-if="sortField === 'image'">
                  <CaretUpOutlined
                    v-if="sortDirection === 'asc'"
                    class="ml-1"
                  />
                  <CaretDownOutlined v-else class="ml-1" />
                </span>
              </th>
              <th
                @click="toggleSort('examName')"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
              >
                Tên bài thi
                <span v-if="sortField === 'examName'">
                  <CaretUpOutlined
                    v-if="sortDirection === 'asc'"
                    class="ml-1"
                  />
                  <CaretDownOutlined v-else class="ml-1" />
                </span>
              </th>
              <th
                colspan="3"
                class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider cursor-pointer"
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="exam in filteredExams" :key="exam.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ exam.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <img class="h-28" :src="exam.image" alt="" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ exam.name }}
              </td>
          
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="handleDeleteExam(exam.id)"
                  class="inline-block px-3 py-2 bg-red-700 text-black rounded-lg"
                >
                  Xóa bài thi
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="openEditExamModal(exam)"
                  class="inline-block px-3 py-2 bg-green-300 text-green-800 rounded-lg"
                >
                  Sửa thông tin bài thi
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="openQuestionPage(exam.id)"
                  :class="'inline-block px-3 py-2 bg-yellow-300 text-yellow-800 rounded-lg'"
                >
                  Xem thông tin các câu hỏi
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import Swal from "sweetalert2";
import ExamModal from "@/components/admin/modal/ExamModal.vue"; // Updated to ExamModal
import { useRoute, useRouter } from "vue-router";
import subject from "@/store/modules/subject";
const store = useStore();
const router= useRouter()
const route = useRoute();
const subjectId = computed(() => route.params.id);
const exams = computed(() => store.state.exam.exams); // Updated state reference
const totalPages = computed(() => store.state.exam.totalPages); // Updated state reference

const sortField = ref("id");
const sortDirection = ref("asc");
const searchQuery = ref("");
const currentPage = ref(1);
const ITEMS_PER_PAGE = 2;

onMounted(() => {
  store.dispatch("exam/fetchPaginatedExams", {
    page: currentPage.value,
    limit: ITEMS_PER_PAGE,
    id:subjectId.value
  });
});
const openQuestionPage =((examId)=>{
  router.push({ name: 'AdminQuestion', params: { id:examId  } });
})

const handleDeleteExam = (id) => {
  swal({
    title: "Cảnh báo?",
    text: "Bạn sẽ xóa bài thi này!",
    icon: "warning",
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      store.dispatch("exam/deleteExam", id);
    } else {
      swal("Your exam is safe!");
    }
  });
};

const toggleSort = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

const sortedExams = computed(() => {
  return [...exams.value].sort((a, b) => {
    if (a[sortField.value] < b[sortField.value])
      return sortDirection.value === "asc" ? -1 : 1;
    if (a[sortField.value] > b[sortField.value])
      return sortDirection.value === "asc" ? 1 : -1;
    return 0;
  });
});

const filteredExams = computed(() => {
  return sortedExams.value.filter((exam) =>
    exam.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handlePageChange = (newPage) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    store.dispatch("exam/fetchPaginatedExams", {
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

const openAddExamModal = () => {
  store.dispatch("modal/openModal", { type: "examModal" });
};

const openEditExamModal = (exam) => {
  store.dispatch("modal/openModal", { type: "examModal", data: exam });
};
</script>
  
  <style scoped>
.admin-exam-list {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
  