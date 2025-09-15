<template>
    <div class="pt-20">
      <div class="flex flex-col md:flex-row gap-8">
        <div class="w-full md:w-1/4 flex flex-col gap-4">
          <RouterLink to="/pages/user/profile">
            <div class="bg-gray-200 text-center p-4 rounded-md cursor-pointer hover:bg-gray-300">Thông tin cá nhân</div>
          </RouterLink>
          <RouterLink to="/user/history">
            <div class="bg-gray-200 text-center p-4 rounded-md cursor-pointer hover:bg-gray-300">Lịch sử làm bài</div>
          </RouterLink>
        </div>
        <div class="w-full md:w-3/4">
          <div v-if="yourProfile" class="flex flex-col md:flex-row gap-4">
            <div class="flex flex-col items-center gap-2 w-full md:w-1/3">
              <img :src="yourProfile.avatar" alt="" class="w-full h-80 object-cover rounded-lg" />
              <h3 class="bg-gray-100 text-center py-2 w-full">{{ yourProfile.nameAccount }}</h3>
              <button @click="changeAvatar" class="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                Thay đổi ảnh
              </button>
              <div class="flex gap-2 mt-4">
                <button @click="confirmProfile" class="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
                  Đổi thông tin
                </button>
                <button @click="changePass" class="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
                  Đổi mật khẩu
                </button>
              </div>
            </div>
            <div class="flex flex-col gap-2 w-full md:w-2/3">
              <div class="flex flex-col gap-1">
                <h5 class="text-gray-700 font-semibold">Email:</h5>
                <p>{{ yourProfile.email }}</p>
              </div>
       
              <div class="flex flex-col gap-1">
                <h5 class="text-gray-700 font-semibold">Số điện thoại:</h5>
                <p>{{ yourProfile.phone }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import CryptoJS from 'crypto-js';
  import { useRouter } from 'vue-router';
  import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
  
  const router = useRouter();
  const yourProfile = ref(null);
  
  onMounted(() => {
    const fetchUser = async () => {
      const idUserLogin = localStorage.getItem('keyLogin');
      if (idUserLogin) {
        try {
          const { buildApiUrl } = await import('@/utils/api.js');
          const response = await axios.get(buildApiUrl(`/accounts/${idUserLogin}`));
          yourProfile.value = response.data;
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    };
    fetchUser();
  });
  
  const confirmProfile = () => {
    Swal.fire({
      title: "Cập nhật thông tin",
      html: `
      <div class="flex flex-col gap-2">
        <label class="text-gray-700 font-semibold">Tên người dùng:</label>
        <input id="nameAccount" class="swal2-input px-4 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500" value="${yourProfile.value?.nameAccount || ""}">
        <label class="text-gray-700 font-semibold">Số điện thoại:</label>
        <input id="phone" class="swal2-input px-4 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500" value="${yourProfile.value?.phone || ""}">
      </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Lưu",
      preConfirm: () => {
        const nameAccount = document.getElementById('nameAccount').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
  
        const phoneRegex = /^\d{10,15}$/;
        if (!phoneRegex.test(phone)) {
          Swal.showValidationMessage("Số điện thoại không hợp lệ! Vui lòng nhập từ 10 đến 15 chữ số.");
          return;
        }
  
        return { nameAccount, address, phone };
      }
    }).then((result) => {
      if (result.isConfirmed && yourProfile.value) {
        const updatedProfile = { ...yourProfile.value, ...result.value };
        saveAccountToBackend(updatedProfile);
        yourProfile.value = updatedProfile;
      }
    });
  };
  
  const changePass = () => {
    Swal.fire({
      title: "Đổi mật khẩu",
      html: `
        <label>Mật khẩu cũ:</label>
        <input type="password" id="oldPassword" class="text-gray-700 font-semibold">
        <label>Mật khẩu mới:</label>
        <input type="password" id="newPassword"  class="text-gray-700 font-semibold">
        <label>Xác nhận mật khẩu mới:</label>
        <input type="password" id="confirmPassword"  class="text-gray-700 font-semibold">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Đổi mật khẩu",
      preConfirm: () => {
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
  
        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage("Mật khẩu xác nhận không khớp!");
          return;
        }
  
        const decryptedPassword = CryptoJS.DES.decrypt(yourProfile.value.password, "secret_key").toString(CryptoJS.enc.Utf8);
        if (decryptedPassword !== oldPassword) {
          Swal.showValidationMessage("Mật khẩu cũ không đúng!");
          return;
        }
  
        const encryptedPassword = CryptoJS.DES.encrypt(newPassword, "secret_key").toString();
        return encryptedPassword;
      }
    }).then((result) => {
      if (result.isConfirmed && yourProfile.value) {
        const updatedProfile = { ...yourProfile.value, password: result.value };
        saveAccountToBackend(updatedProfile);
        yourProfile.value = updatedProfile;
      }
    });
  };
  
  const changeAvatar = () => {
    Swal.fire({
      title: "Chọn ảnh",
      input: "file",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your profile picture",
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const file = result.value;
        const storage = getStorage();
        const storageReference = storageRef(storage, `profile-pictures/${file.name}`);
        uploadBytes(storageReference, file).then(snapshot => {
          getDownloadURL(snapshot.ref).then(downloadURL => {
            if (yourProfile.value) {
              const updatedProfile = { ...yourProfile.value, img: downloadURL };
              saveAccountToBackend(updatedProfile);
              yourProfile.value = updatedProfile;
            }
          });
        });
      }
    });
  };
  
  const saveAccountToBackend = async (account) => {
    const { buildApiUrl } = await import('@/utils/api.js');
    axios.put(buildApiUrl(`/accounts/${account.id}`), account)
      .then(response => {
        Swal.fire("Thành công", "Thông tin cá nhân đã được cập nhật", "success");
      })
      .catch(error => {
        console.error("Error updating profile:", error);
        Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật thông tin cá nhân", "error");
      });
  };
  </script>
  