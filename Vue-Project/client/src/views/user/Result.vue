<template>
  <div class="container mx-auto p-6">
    <section class="section bg-white shadow-md rounded-lg p-6 mb-6">
      <div class="flex justify-between">
        <div class="left-container min-w-[20vw]">
          <div class="result" v-if="result">
            <div class="mark text-4xl font-bold text-center" id="mark">
              {{ result.score?.toFixed(2) || "N/A" }}
            </div>
            <div class="info mt-2 text-center" id="infoExem">
              <h1 class="text-2xl font-semibold">
                {{ exam?.name || "Exam Title" }}
              </h1>
              <div class="quantity flex justify-center space-x-6 mt-3">
                <div class="exam-turn flex items-center">
                  <i class="fa-regular fa-calendar-check mr-1"></i>
                  <span>Ngày thi: {{ formattedDate }}</span>
                </div>
                <div class="time flex items-center">
                  <i class="fa-regular fa-clock mr-1"></i>
                  <span>Thời gian: {{ result.time || "N/A" }}</span>
                </div>
                <div class="questions flex items-center">
                  <i class="fa-regular fa-circle-question mr-1"></i>
                  <span>{{ questions.length }} câu hỏi</span>
                </div>
              </div>
              <div class="button mt-4">
                <RouterLink :to="`/user/test/${exam.id}`">
                  <button
                    class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded"
                  >
                    Thi lại <i class="fa-solid fa-rotate-left"></i>
                  </button>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <div class="right-container overflow-auto flex items-center">
          <div class="flex items-center flex-wrap">
            <div
              v-for="(question, index) in questions"
              :key="index"
              class="flex items-center mb-2"
            >
              <div
                :class="[
                  'number rounded-full h-10 w-10 flex items-center justify-center text-white font-bold mx-2' /* Adjusted mx-2 for spacing */,
                  ,
                  result.answers[index]?.isCorrect
                    ? 'bg-green-500'
                    : 'bg-red-500',
                ]"
              >
                {{ index + 1 }}
              </div>
              <div class="ml-2 text-lg">
                <span
                  v-if="result.answers[index]?.isCorrect"
                  class="text-green-600"
                  >✔️ Đúng</span
                >
                <span v-else class="text-red-600">❌ Sai</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <hr class="my-6" />

    <div class="num-questions">
      <div
        v-for="(question, index) in currentQuestions"
        :key="index"
        class="question mb-4 p-4 border rounded-lg shadow-md bg-gray-50"
      >
        <b class="text-lg">{{ index + 1 }}</b>
        <p class="mt-1">{{ question.text }}</p>
        <form :id="`answerForm${index}`" class="radio mt-2">
          <div
            v-for="(option, optIndex) in question.answerList"
            :key="optIndex"
          >
            <input
              type="radio"
              :id="`answer${optIndex}`"
              :name="`question${index}`"
              :value="optIndex"
              readonly
              class="hidden"
            />
            <label
              :for="`answer${optIndex}`"
              class="block p-2 border rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition duration-150"
            >
              {{ option.answer }}
            </label>
          </div>
        </form>
        <div class="reason mt-2">
          <p class="font-semibold">GIẢI THÍCH</p>
          <p>
            Đáp án đúng:
            <span class="bg-green-100 text-green-700 font-semibold p-1 rounded">
              {{ correctAnswer(question)?.answer || "Không có đáp án đúng" }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Pagination Buttons -->
    <div class="pagination flex justify-center space-x-2 mt-6">
      <button
        @click="paginate(currentPage - 1)"
        :disabled="currentPage === 1"
        class="prev-next bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Previous
      </button>
      <button
        v-for="pageIndex in pageCount"
        :key="pageIndex - 1"
        @click="paginate(pageIndex)"
        :class="[
          'px-4 py-2 rounded transition duration-150',
          currentPage === pageIndex
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 hover:bg-gray-300',
        ]"
      >
        {{ pageIndex }}
      </button>
      <button
        @click="paginate(currentPage + 1)"
        :disabled="currentPage === pageCount"
        class="prev-next bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>
  
  
  <script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const props = defineProps({
  params: { type: Object, required: true },
});
const route = useRoute();
const idTest = computed(() => route.params.id);
const result = ref(null);
const exam = ref(null);
const questions = ref([]);
const currentPage = ref(1);
const questionsPerPage = 2;

const fetchResult = async () => {
  try {
    const response = await axios.get("http://localhost:3000/userAnswers");
    const resultData = response.data.find((r) => r.id == idTest.value);
    result.value = resultData || null;
  } catch (error) {
    console.error("Error fetching result:", error);
  }
};

const fetchExam = async () => {
  try {
    const { buildApiUrl, API_ENDPOINTS } = await import('@/utils/api.js');
    const response = await axios.get(buildApiUrl(API_ENDPOINTS.EXAMS));
    const examData = response.data.find((e) => e.id == result.value?.idExam);
    exam.value = examData || null;
  } catch (error) {
    console.error("Error fetching exam:", error);
  }
};

// Fetch questionss
const fetchQuestions = async () => {
  try {
    const { buildApiUrl, API_ENDPOINTS } = await import('@/utils/api.js');
    const response = await axios.get(buildApiUrl(API_ENDPOINTS.QUESTIONS_BY_EXAM(result.value?.idExam)));
    questions.value = response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
};

onMounted(() => {
  fetchResult();
});
const formattedDate = computed(() => {
  if (result.value && result.value.date) {
    const dateParts = result.value.date.split(",")[0]; 
    return new Date(dateParts).toLocaleDateString("vi-VN"); 
  }
  return "N/A"; 
});

watch(result, (newResult) => {
  if (newResult) {
    fetchExam();
    fetchQuestions();
  }
});

const paginate = (pageNumber) => {
  currentPage.value = pageNumber;
};

const indexOfLastQuestion = computed(
  () => currentPage.value * questionsPerPage
);
const indexOfFirstQuestion = computed(
  () => indexOfLastQuestion.value - questionsPerPage
);
const currentQuestions = computed(() =>
  questions.value.slice(indexOfFirstQuestion.value, indexOfLastQuestion.value)
);
const pageCount = computed(() =>
  Math.ceil(questions.value.length / questionsPerPage)
);

const correctAnswer = (question) =>
  question.answerList.find((answer) => answer.status === 1);
</script>
  
  <style scoped>
</style>
  