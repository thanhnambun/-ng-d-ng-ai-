<template>
  <div>
    <header class="bg-gray-800 text-black shadow">
      <div class="flex justify-between items-center p-4 md:px-8">
        <div class="header-left flex items-center">
          <a href="#">
            <img
              src="https://i.pinimg.com/236x/54/bb/61/54bb61e0ecc1526dc0d2defdd339c2d4.jpg"
              alt="Logo"
              class="w-16 h-16 rounded-full"
            />
          </a>
          <p class="text-xl font-semibold ml-2">TestU</p>
        </div>
        <div class="container1 flex-grow">
          <form id="form-input" class="relative">
            <input
              type="search"
              placeholder="Tìm kiếm đề"
              v-model="searchQuery"
              @input="handleSearch"
              class="w-full p-2 bordert  border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <ul v-if="searchQuery" class="absolute left-0 z-10 mt-1 w-full bg-gray-800 border border-gray-300 rounded-lg shadow-lg">
              <li v-for="exam in filteredExams" :key="exam.id" class="search-results">
                <RouterLink :to="'/user/contest/' + exam.id" class="block px-4 py-2 hover:bg-gray-700 text-black">{{ exam.name }}</RouterLink>
              </li>
              <li v-if="filteredExams.length === 0" class="search-results px-4 py-2 text-gray-300">
                Không có kết quả phù hợp
              </li>
            </ul>
          </form>
        </div>
        <div class="header-right flex items-center">
          <nav class="header-nav flex space-x-4">
            <RouterLink :to="`/user/home`" class="nav-item text-gray-300 hover:text-blue-500">Trang chủ</RouterLink>
            <RouterLink :to="`/user/course`" class="nav-item text-gray-300 hover:text-blue-500">Trang khóa thi</RouterLink>
          </nav>
          <div id="loginOut" class="ml-4 flex items-center">
            <div v-if="!login" class="btn-login flex space-x-4">
              <RouterLink :to="`/login`" class="nav-item text-gray-300 hover:text-blue-500">Đăng nhập</RouterLink>
              <RouterLink :to="`/register`" class="nav-item text-gray-300 hover:text-blue-500">Đăng ký</RouterLink>
            </div>
            <div v-else class="user-info flex items-center">
              <img
                :src="user?.avatar || ''"
                alt="User Avatar"
                class="w-10 h-10 rounded-full cursor-pointer"
                @click="goToProfile"
              />
              <span class="ml-2">Hi, {{ user?.nameAccount }}</span>
              <button @click="handleLogout" class="ml-4 text-blue-400 hover:underline">Đăng xuất</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  setup() {
    const login = ref(false);
    const user = ref(null);
    const subjectList = ref([]);
    const examList = ref([]);
    const filteredExams = ref([]);
    const searchQuery = ref('');

    onMounted(async () => {
      const idUserLogin = localStorage.getItem('keyLogin');
      console.log(idUserLogin);
      
      if (idUserLogin) {
        try {
          const { data: users } = await axios.get('http://localhost:3000/accounts');
          const currentUser = users.find((user) => user.id == idUserLogin);
          if (currentUser) {
            user.value = currentUser;
            login.value = true;
          } else {
            login.value = false;
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      } else {
        login.value = false;
      }

      try {
        const { data: subjects } = await axios.get('http://localhost:3000/subjects');
        subjectList.value = subjects;

        const { data: exams } = await axios.get('http://localhost:3000/exams');
        examList.value = exams;
        filteredExams.value = exams; // Initialize filtered exam list
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    });

    const handleLogout = () => {
      Swal.fire({
        title: 'Bạn có chắc muốn đăng xuất?',
        text: 'Bạn sẽ cần phải đăng nhập lại để sử dụng các chức năng khác.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Hủy bỏ',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('keyLogin');
          login.value = false;
          user.value = null;

          Swal.fire('Đã đăng xuất!', '', 'success');
          window.location.href = '/login';
        }
      });
    };

    const handleSearch = () => {
      const filter = searchQuery.value.toUpperCase();
      filteredExams.value = examList.value.filter((exam) =>
        exam.name.toUpperCase().includes(filter)
      );
    };

    const goToProfile = () => {
      window.location.href = '/user/profile';
    };

    return {
      login,
      user,
      subjectList,
      examList,
      filteredExams,
      searchQuery,
      handleLogout,
      handleSearch,
      goToProfile,
    };
  },
};
</script>

<style scoped>
</style>
