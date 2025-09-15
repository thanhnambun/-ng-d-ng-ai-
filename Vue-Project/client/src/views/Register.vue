<template>
  <div class="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
    <LoadingSpinner v-show="loading" />
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Đăng kí
      </h2>
    </div>
    <form
      @submit.prevent="handleSubmit"
      class="mx-auto mt-16 max-w-xl sm:mt-20"
    >
      <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label
            for="email"
            class="block text-sm font-semibold leading-6 text-gray-900"
          >
            Email
          </label>
          <div class="mt-2.5">
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p v-show="errors && errors.email" class="text-red-500 text-sm mt-1">
                {{ errors.email }}
              </p>
          </div>
        </div>
        <div class="sm:col-span-2">
          <label
            for="name"
            class="block text-sm font-semibold leading-6 text-gray-900"
          >
            Tên người dùng
          </label>
          <div class="mt-2.5">
            <input
              id="name"
              v-model="formData.name"
              type="text"
              class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p v-show="errors.name" class="text-red-500 text-sm mt-1">
              {{ errors.name }}
            </p>
          </div>
        </div>

        <div class="sm:col-span-2">
          <label
            for="password"
            class="block text-sm font-semibold leading-6 text-gray-900"
          >
            Mật khẩu
          </label>
          <div class="mt-2.5">
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p v-show="errors.password" class="text-red-500 text-sm mt-1">
              {{ errors.password }}
            </p>
          </div>
        </div>

        <div class="sm:col-span-2">
          <label
            for="phone"
            class="block text-sm font-semibold leading-6 text-gray-900"
          >
            Số điện thoại
          </label>
          <div class="mt-2.5">
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p v-show="errors.phone" class="text-red-500 text-sm mt-1">
              {{ errors.phone }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <button
          type="submit"
          class="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Đăng kí
        </button>
      </div>
    </form>
  </div>
</template>
  
<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const store = useStore();
const router = useRouter();

const formData = ref({
  password: "",
  email: "",
  phone: "",
  name: "",
});
const loading = computed(() => store.state.account.loading);
const errors = computed(() => store.state.account.error || {});


const checkUnique = async () => {
  const newErrors = {};
  try {
    const { buildApiUrl, apiHelpers } = await import('@/utils/api.js');
    const [phoneResponse, emailResponse] = await Promise.all([
      axios.get(apiHelpers.filter('accounts', { phone: formData.value.phone })),
      axios.get(apiHelpers.filter('accounts', { email: formData.value.email }))
    ]);

    if (phoneResponse.data.length > 0) {
      newErrors.phone = "Số điện thoại đã tồn tại";
    }

    if (emailResponse.data.length > 0) {
      newErrors.email = "Email đã tồn tại";
    }
  } catch (error) {
    store.commit("account/SET_ERROR", "Có lỗi xảy ra khi kiểm tra tính duy nhất");
  }  
   store.commit("account/SET_ERROR", {...newErrors});
  return newErrors;
};

const validate = async () => {
  let newErrors = {};
  if (!formData.value.password || formData.value.password.length < 7)
    newErrors.password = "Mật khẩu phải có ít nhất 7 kí tự";
  if (!formData.value.email) {
    newErrors.email = "Email là bắt buộc";
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    newErrors.email = "Email không hợp lệ";
  }
  if (!formData.value.phone) newErrors.phone = "Số điện thoại là bắt buộc";

  const uniquenessErrors = await checkUnique();
  
  newErrors = { ...newErrors, ...uniquenessErrors }; // Gộp lỗi

  // Cập nhật Vuex
  store.commit("account/SET_ERROR", {...newErrors});
  console.log(errors.value);
  console.log(errors);
  
  return Object.keys(newErrors).length === 0; // Kiểm tra xem có lỗi hay không
};

// Hàm handle submit
const handleSubmit = async (e) => {
  e.preventDefault();

  // Bật trạng thái loading từ Vuex
  store.commit("account/SET_LOADING", true);

  if (await validate()) {
    
    const encryptedPassword = CryptoJS.DES.encrypt(
      formData.value.password,
      "secret_key"
    ).toString();

    const user = {
      ...formData.value,
      password: encryptedPassword,
      id: Math.floor(Math.random() * 10000),
      status: 1, // Trạng thái mặc định
      role: false, // Role mặc định là user
      avatar: "https://firebasestorage.googleapis.com/v0/b/online-social-bafa3.appspot.com/o/Clone.jfif?alt=media&token=bbbaac8c-a899-475d-a0b2-012958f66173",
      created_at: new Date().toLocaleDateString("vi-VN"),
      updated_at: new Date().toLocaleDateString("vi-VN"),
    };

    try {
      // Gửi dữ liệu người dùng lên API
      console.log(user);
      
      await store.dispatch("account/addAccount", {...user});
      // Thông báo thành công
      Swal.fire({
        icon: "success",
        title: "Welcome",
        text: "Đăng kí thành công",
        timer: 2000,
        showConfirmButton: false,
      });

      // Điều hướng tới trang đăng nhập
      router.push("/login");
      formData.value = {
        password: "",
        email: "",
        phone: "",
        name: "",
      };
      store.commit("account/SET_ERROR", {}); // Reset lại lỗi

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đăng kí thất bại, vui lòng thử lại",
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Vui lòng kiểm tra lại thông tin đăng ký",
    });
  }

  // Tắt trạng thái loading
  store.commit("account/SET_LOADING", false);
};
</script>

  <style scoped>
</style>
  