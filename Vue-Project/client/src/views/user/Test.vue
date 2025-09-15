<template>
    <div class="bg-gray-100 min-h-screen flex flex-col">
      <div class="bg-white shadow-md flex justify-between items-center p-4">
        <div class="flex items-center">
          <img
            src="https://static.vecteezy.com/system/resources/previews/009/182/690/original/thi-letter-logo-design-with-polygon-shape-thi-polygon-and-cube-shape-logo-design-thi-hexagon-logo-template-white-and-black-colors-thi-monogram-business-and-real-estate-logo-vector.jpg"
            alt="Logo"
            class="h-16 w-16 object-cover mr-2"
          />
          <p class="text-xl font-bold">OnlineTest</p>
        </div>
        <div>
          <button
            class="text-3xl bg-yellow-400 rounded-full p-2 focus:outline-none"
            @click="router.push(`/user/test/${idExam}`)"
          >
            <font-awesome-icon :icon="faSignOutAlt" />
          </button>
        </div>
      </div>
  
      <section class="flex flex-grow p-4">
        <div class="flex flex-col items-center w-1/4">
          <div class="flex flex-col items-center mb-4">
            <img :src="user.avatar" alt="User Avatar" class="h-24 w-24 rounded-full border-2 border-gray-300" />
            <p class="mt-2 text-lg font-semibold">{{ user.name }}</p>
          </div>
          <div class="flex items-center">
            <span class="text-5xl">
              <font-awesome-icon :icon="faClock" />
            </span>
            <div id="countdown" class="ml-2 text-3xl">{{ formatTime(countdown) }}</div>
          </div>
        </div>
  
        <div class="flex flex-col w-1/2 overflow-y-auto" style="max-height: 600px;" v-if="currentQuestion">
          <div class="bg-white shadow-md p-4 rounded mb-4">
            <h1 class="text-2xl font-semibold">{{ `Câu ${currentQuestionIndex + 1}:` }}</h1>
            <span class="block text-lg mt-2">{{ currentQuestion.text }}</span>
          </div>
  
          <form class="flex flex-col">
            <div
              v-for="(answer, idx) in currentQuestion.answerList"
              :key="idx"
              class="flex items-center mb-2"
            >
              <input
                name="answer"
                type="radio"
                :checked="userAnswers[currentQuestionIndex] === idx.toString()"
                @change="handleAnswerChange(currentQuestionIndex, idx)"
                class="mr-2 h-5 w-5"
              />
              <p class="text-lg">{{ answer.answer }}</p>
            </div>
          </form>
  
          <div class="flex justify-between mt-4">
            <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="prevQuestion">Câu trước</button>
            <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="nextQuestion">Câu sau</button>
          </div>
        </div>
  
        <div class="flex flex-col items-center w-1/4">
          <div class="overflow-y-auto max-h-[600px] w-full flex flex-wrap justify-center">
            <button
              v-for="(_, idx) in shuffledQuestions"
              :key="idx"
              :class="[
                'bg-gray-200 text-lg p-2 rounded-full mx-1 my-1',
                userAnswers[idx] !== undefined ? 'bg-green-400' : '',
                currentQuestionIndex === idx ? 'bg-blue-500 text-white' : '',
              ]"
              @click="goToQuestion(idx)"
            >
              {{ idx + 1 }}
            </button>
          </div>
          <button class="bg-red-500 text-white px-4 py-2 rounded mt-4" @click="handleSubmit">Nộp bài</button>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import { faSignOutAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import { toRaw } from "vue";
const login = ref(false);
const user = ref({
  avatar: "",
  name: "",
  email: "",
  phone: "",
  id: null,
  status: 0,
  role: false,
  created_at: "",
  updated_at: "",
});
const yourProfile = ref(null);
const shuffledQuestions = ref([]);
const currentQuestionIndex = ref(0);
const userAnswers = ref([]);
const countdown = ref(1200);
const route = useRoute();
const idExam = computed(() => route.params.id);
const exam = ref(null); 

const router = useRouter();
onMounted(async () => {
  await fetchUser();
  await fetchQuestions();
  await fetchExam();
  startCountdown();
});

watch(countdown, (newValue) => {
  if (newValue === 0) handleSubmit();
});

const fetchExam = async () => {
  try {
    const { buildApiUrl } = await import('@/utils/api.js');
    const response = await axios.get(buildApiUrl(`/exams/${idExam.value}`));
    exam.value = response.data; 
  } catch (error) {
    console.error("Error fetching exam data:", error);
  }
};
const fetchUser = async () => {
  const idUserLogin = localStorage.getItem("keyLogin");
  if (idUserLogin) {
    try {
      const { buildApiUrl, API_ENDPOINTS } = await import('@/utils/api.js');
      const response = await axios.get(buildApiUrl(API_ENDPOINTS.ACCOUNTS));
      const users = response.data;
      const currentUser = users.find((user) => user.id == idUserLogin);
      if (currentUser) {
        user.value = currentUser;
        login.value = true;
        yourProfile.value = currentUser;
      } else {
        login.value = false;
        showAlertAndRedirect("User not found!", "Redirecting to login...");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  } else {
    login.value = false;
    showAlertAndRedirect("Bạn chưa đăng nhập!", "Vui lòng thực hiện đăng nhập");
  }
};

const showAlertAndRedirect = (title, text) => {
  Swal.fire({ title, text, icon: "error" }).then(() => {
    router.push("/pages/user/sign-in");
  });
};

const fetchQuestions = async () => {
  try {
    const { buildApiUrl, API_ENDPOINTS } = await import('@/utils/api.js');
    const response = await axios.get(buildApiUrl(API_ENDPOINTS.QUESTIONS_BY_EXAM(idExam.value)));
    const questions = response.data;
    console.log(response.data.filter((q) => q.idExam == idExam));

    shuffledQuestions.value = shuffleArray(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
};

const shuffleArray = (array) => {
  return array
    .map((q) => ({
      ...q,
      answerList: q.answerList.sort(() => Math.random() - 0.5),
    }))
    .sort(() => Math.random() - 0.5);
};

const handleAnswerChange = (index, answerIndex) => {
  userAnswers.value[index] = answerIndex.toString();
  localStorage.setItem("userAnswers", JSON.stringify(userAnswers.value));
};

const handleSubmit = async () => {
  Swal.fire({
    title: "Bạn có chắc chắn nộp bài không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let score = calculateScore();
      const examResult = prepareExamResult(score);
      try {
        await submitExamResult(examResult);

        updateUserProfile(score, examResult.time);
        const { buildApiUrl } = await import('@/utils/api.js');
        await axios.put(buildApiUrl(`/exams/${idExam.value}`), {
          ...exam.value,
          sequence: (exam.value.sequence || 0) + 1, // Tăng số lượt thi
        });

        Swal.fire({
          title: "Nộp bài thành công!",
          text: `Điểm của bạn là ${score.toFixed(2)}. Thời gian làm bài: ${
            examResult.time
          }`,
          icon: "success",
        });
        router.push(`/user/result/${examResult.id}`);
      } catch (error) {
        console.error("Error submitting exam:", error);
        Swal.fire({
          title: "Có lỗi xảy ra!",
          text: "Không thể nộp bài thi. Vui lòng thử lại.",
          icon: "error",
        });
      }
    }
  });
};

const calculateScore = () => {
    console.log(shuffledQuestions.value.reduce(
    (count, question, index) => {
      return userAnswers.value[index] &&
        question.answerList[userAnswers.value[index]].status === 1
        ? count + 1
        : count;
    },
    0
  ));
    
  const correctAnswers = shuffledQuestions.value.reduce(
    (count, question, index) => {
      return userAnswers.value[index] &&
        question.answerList[userAnswers.value[index]].status === 1
        ? count + 1
        : count;
    },
    0
  );
  return (correctAnswers / shuffledQuestions.value.length) * 10;
};

const prepareExamResult = (score) => {
  const timeTaken = 1200 - countdown.value;
  return {
    id: Math.floor(Math.random() * 10000),
    idExam: idExam.value, // Lấy giá trị thực của idExam
    idUser: user.value.id,
    score,
    time: formatTime(timeTaken),
    date: new Date().toLocaleString(),
    answers: shuffledQuestions.value.map((q, idx) => ({
      questionId: q.id,
      selectedAnswer: userAnswers.value[idx] || null,
      isCorrect:
        userAnswers.value[idx] &&
        q.answerList[userAnswers.value[idx]].status === 1,
    })),
  };
};
const submitExamResult = async (examResult) => {
  try {
    const { buildApiUrl, API_ENDPOINTS } = await import('@/utils/api.js');
    await axios.post(buildApiUrl(API_ENDPOINTS.USER_ANSWERS), examResult);
  } catch (error) {
    console.log(error);
  }
};
const updateUserProfile = async (score, time) => {
  const updatedUser = {
    ...user.value,
    result: [
      ...user.value.result,
      { idTest: Math.random(), score, time, date: new Date().toLocaleString() },
    ],
  };
  const { buildApiUrl } = await import('@/utils/api.js');
  await axios.put(
    buildApiUrl(`/accounts/${user.value.id}`),
    updatedUser
  );
};

const startCountdown = () => {
  setInterval(() => {
    countdown.value = Math.max(countdown.value - 1, 0);
  }, 1000);
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const prevQuestion = () => {
  currentQuestionIndex.value = Math.max(0, currentQuestionIndex.value - 1);
};

const nextQuestion = () => {
  currentQuestionIndex.value = Math.min(
    shuffledQuestions.value.length - 1,
    currentQuestionIndex.value + 1
  );
};

const goToQuestion = (index) => {
  currentQuestionIndex.value = index;
};

const currentQuestion = computed(() =>
  shuffledQuestions.value.length
    ? shuffledQuestions.value[currentQuestionIndex.value]
    : null
);
</script>
  
  <style scoped>
</style>
  