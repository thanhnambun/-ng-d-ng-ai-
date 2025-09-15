<template>
  <div>
    <footer class="bg-gray-800 text-white mt-8 py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between"> 
          <div class="footer-left w-full md:w-2/3 mb-6">
            <div class="footer-logo flex items-center mb-4">
              <img
                id="img"
                src="https://i.pinimg.com/236x/54/bb/61/54bb61e0ecc1526dc0d2defdd339c2d4.jpg"
                alt="TestOnline Logo"
                class="w-24 h-24 rounded-full"
              />
              <h1 class="text-lg font-medium ml-4">
                TestU - Luyện thi miễn phí.
              </h1>
            </div>
            <p class="text-gray-300 mb-4">
               là một hệ thống thi trắc nghiệm trực tuyến linh hoạt và tiện ích. Người dùng có thể tạo và tham gia các bài kiểm tra, với các loại câu hỏi đa dạng và tính năng tùy chỉnh, cùng công cụ quản lý. Đây là giải pháp hiệu quả để ôn tập và theo dõi quá trình học tập.
            </p>
            <div class="social-icons flex space-x-4">
              <FontAwesomeIcon icon="fa-brands fa-facebook" class="text-gray-300 hover:text-white transition-colors duration-300" />
              <FontAwesomeIcon icon="fa-brands fa-twitter" class="text-gray-300 hover:text-white transition-colors duration-300" />
              <FontAwesomeIcon icon="fa-brands fa-github" class="text-gray-300 hover:text-white transition-colors duration-300" />
              <FontAwesomeIcon icon="fa-brands fa-instagram" class="text-gray-300 hover:text-white transition-colors duration-300" />
            </div>
          </div>
          <div class="footer-right w-full md:w-1/3">
            <table class="w-full text-left text-gray-400">
              <thead>
                <tr>
                  <th class="py-2">Về TestOnline</th>
                  <th class="py-2">Hỗ trợ</th>
                  <th class="py-2">Thông tin khác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in footerItems" :key="index">
                  <td class="py-2">
                    <FontAwesomeIcon :icon="item.icon" width="20" height="20" class="mr-2" />
                    {{ item.title }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <hr class="my-4 border-gray-600" />
        <div class="flex justify-between items-center">
          <div class="end-left flex items-center">
            <span>@ 2024 TestOnline. Created with</span>
            <FontAwesomeIcon icon="fa-solid fa-heart" class="text-red-500 mx-1" />
            <span>by Dung Pham</span>
          </div>
          <div class="end-right">
            <span>Trao tri thức - Nhận niềm tin!</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { 
  faBuilding, faUsers, faShop, faCircleInfo, 
  faShieldHalved, faTruckFast, faBlog, 
  faCircleQuestion, faHandshake, faHeart 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook, faTwitter, faGithub, faInstagram 
} from '@fortawesome/free-brands-svg-icons'; 

const footerItems = [
  { icon: faBuilding, title: "Group 3" },
  { icon: faUsers, title: "Tuyển dụng" },
  { icon: faShop, title: "Group 3 Mall" },
  { icon: faCircleInfo, title: "Điều khoản" },
  { icon: faShieldHalved, title: "Bảo mật" },
  { icon: faTruckFast, title: "Dịch vụ" },
  { icon: faBlog, title: "Group 3 blog" },
  { icon: faCircleQuestion, title: "Thông tin đề thi" },
  { icon: faHandshake, title: "Cam kết" },
];
</script>

<style scoped>
/* Additional styles can be added here if necessary */
</style>
