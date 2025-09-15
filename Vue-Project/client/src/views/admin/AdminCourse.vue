<template>
  <div class="admin-course-list bg-gray-100 p-6">
    <div class="flex justify-between p-3 bg-slate-400">
      <h2 class="text-xl font-semibold mb-4">Danh sách người dùng</h2>
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
        @click="openAddCourseModal()"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Thêm khóa học
      </button>
    </div>

    <CourseModal />

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
                @click="toggleSort('courseName')"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
              >
                Tên khóa học
                <span v-if="sortField === 'courseName'">
                  <CaretUpOutlined
                    v-if="sortDirection === 'asc'"
                    class="ml-1"
                  />
                  <CaretDownOutlined v-else class="ml-1" />
                </span>
              </th>
              <th
                colspan="3"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="course in filteredCourses" :key="course.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ course.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <img class="h-28" :src="course.image" alt="" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ course.name }}
              </td>
       

              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="handleDeleteCourse(course.id)"
                  :class="'inline-block px-3 py-2 bg-red-700 text-black rounded-lg'"
                >
                  Xóa khóa học
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="openEditCourseModal(course)"
                  :class="'inline-block px-3 py-2 bg-green-300 text-green-800 rounded-lg'"
                >
                  Sửa thông tin khóa học
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="openSubjectPage(course.id)"
                  :class="'inline-block px-3 py-2 bg-yellow-300 text-yellow-800 rounded-lg'"
                >
                  Xem thông tin các môn học
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
          :class="{
            'bg-gray-300 text-gray-600 cursor-not-allowed':
              currentPage === 1,
            'bg-white hover:bg-gray-100 text-gray-700':
              currentPage !== 1,
          }"
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
          :class="{
            'bg-gray-300 text-gray-600 cursor-not-allowed':
              currentPage === totalPages,
            'bg-white hover:bg-gray-100 text-gray-700':
              currentPage !== totalPages,
          }"
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
import CourseModal from "@/components/admin/modal/CourseModal.vue";
import { useRouter } from "vue-router";
const store = useStore();
const router=useRouter();
const courses = computed(() => store.state.course.course);
const totalPages = computed(() => store.state.course.totalPages);

const courseForm = ref({
  id: 0,
  courseName: "",
  image: "",
  description: "",
});

const sortField = ref("id");
const sortDirection = ref("asc");
const searchQuery = ref("");
const currentPage = ref(1);

const ITEMS_PER_PAGE = 2;

onMounted(() => {
  console.log(111111111111);
  store.dispatch("course/fetchPaginatedCourses", {
    page: currentPage.value,
    limit: ITEMS_PER_PAGE,
  });
});

const handleDeleteCourse = (id) => {
  Swal.fire({
    title: "Cảnh báo?",
    text: "Bạn có chắc muốn xóa khóa học này?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
    confirmButtonColor: "#dc2626",
  }).then((result) => {
    if (result.isConfirmed) {
      store.dispatch("course/deleteCourse", id);
      Swal.fire({
        icon: "success",
        title: "Đã xóa!",
        text: "Khóa học đã được xóa thành công",
        timer: 2000,
        showConfirmButton: false,
      });
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

const sortedCourses = computed(() => {
  console.log(courses.value);
  
  return [...courses.value].sort((a, b) => {
    if (a[sortField.value] < b[sortField.value])
      return sortDirection.value === "asc" ? -1 : 1;
    if (a[sortField.value] > b[sortField.value])
      return sortDirection.value === "asc" ? 1 : -1;
    return 0;
  });
});
const openSubjectPage = (courseId) => {
  router.push({ name: 'AdminSubject', params: { id: courseId } });
};
const filteredCourses = computed(() => {
  return sortedCourses.value.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
const handlePageChange = (newPage) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    store.dispatch("course/fetchPaginatedCourses", {
      page: currentPage.value,
      limit: ITEMS_PER_PAGE,
    });
  }
};
const openAddCourseModal = () => {
  store.dispatch("modal/openModal", { type: "courseModal" });
};

const openEditCourseModal = (course) => {
  store.dispatch("modal/openModal", { type: "courseModal", data: course });
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
  