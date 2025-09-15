<template>
  <div>
    <br /><br /><br /><br /><br />
    <main class="bg-gray-100">
      <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 class="text-2xl font-bold text-center">Thông tin đề thi</h1>
        <div class="flex flex-col md:flex-row md:space-x-4 mt-4">
          <div class="flex-1">
            <div class="flex items-start space-x-4">
              <img
                class="w-48 h-32 object-cover"
                :src="exam.image"
                :alt="exam.name"
              />
              <div class="flex-1">
                <h2 class="text-xl font-semibold">{{ exam.name }}</h2>
                <div class="mt-2 space-y-1">
                  <div class="flex items-center">
                    <i class="fas fa-calendar-days" />
                    <span class="ml-2">Số lượt thi: {{ exam.sequence }}</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fa-solid fa-circle-question" />
                    <span class="ml-2"
                      >Số câu hỏi: {{ exam.numQuestions }}</span
                    >
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-clock" />
                    <span class="ml-2">Thời gian làm bài: 30 phút</span>
                  </div>
                </div>
                <div class="flex mt-2">
                  <i
                    class="fas fa-star text-yellow-400"
                    v-for="n in 5"
                    :key="n"
                  />
                </div>
                <RouterLink
                  :to="`/user/test/${exam.id}`"
                  class="mt-4 inline-flex items-center text-blue-500 font-bold"
                >
                  <i class="fas fa-user-clock mr-2" />
                  Bắt Đầu Làm Bài
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <section class="mt-8">
          <h2 class="text-xl font-semibold">Đề Thi Tham Khảo</h2>
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
          >
            <div
              v-for="referenceExam in referenceExams"
              :key="referenceExam.id"
              class="bg-gray-100 p-4 rounded-lg shadow"
            >
              <img
                :src="referenceExam.image"
                :alt="referenceExam.name"
                class="w-full h-32 object-cover mb-2"
              />
              <h3 class="font-semibold">{{ referenceExam.name }}</h3>
              <p>Số câu hỏi: {{ referenceExam.numQuestions }}</p>
              <p>Số lượt thi: {{ referenceExam.sequence }}</p>
              <RouterLink
                :to="`/user/contest/${referenceExam.id}`"
                class="text-blue-500 mt-2 block"
                >Xem Chi Tiết</RouterLink
              >
            </div>
          </div>

        </section>

        <section class="mt-8">
          <h2 class="text-xl font-semibold">Đánh Giá</h2>
          <div v-if="currentUser" class="mt-4">
            <div class="mb-4">
              <textarea
                v-model="newComment"
                placeholder="Nhập bình luận của bạn"
                class="w-full h-24 p-2 border rounded"
              />
              <button
                @click="handleAddOrUpdateComment"
                class="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                {{ editingCommentId ? "Cập Nhật Bình Luận" : "Thêm Bình Luận" }}
              </button>
            </div>
          </div>
          <button @click="toggleShowComments" class="text-blue-500 mb-4">
            {{
              showAllComments
                ? "Thu gọn bình luận"
                : "Hiển thị tất cả bình luận"
            }}
          </button>

          <div
            v-for="comment in displayedComments"
            :key="comment.id"
            class="flex mb-4"
          >
            <img
              :src="comment.user.img"
              alt="User"
              class="w-12 h-12 rounded-full mr-4"
            />
            <div class="flex-1">
              <h3 class="font-semibold">{{ comment.user.nameAccount }}</h3>
              <p>{{ comment.content }}</p>
              <span class="text-gray-500 text-sm">{{
                new Date(comment.date).toLocaleString()
              }}</span>
              <div
                v-if="currentUser && currentUser.id === comment.idUser"
                class="mt-2"
              >
                <button
                  @click="editComment(comment)"
                  class="text-blue-500 mr-2"
                >
                  Sửa
                </button>
                <button
                  @click="handleDeleteComment(comment.id)"
                  class="text-red-500"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
  
<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRoute } from "vue-router";


const exam = ref([]);
const referenceExams = ref([]);
const currentUser = ref(null);
const newComment = ref("");
const editingCommentId = ref(null);
const showAllComments = ref(false);
const comments = ref([]);
const route=useRoute();
const examId = computed(() => route.params.id);
onMounted(async () => {
  try {
    const { buildApiUrl, API_ENDPOINTS } = await import('@/utils/api.js');
    
    const examResponse = await axios.get(buildApiUrl(`/exams/${examId.value}`));
    exam.value = examResponse.data;
    const allExamsResponse = await axios.get(buildApiUrl(API_ENDPOINTS.EXAMS));
    const allExams = allExamsResponse.data;
    referenceExams.value = getRandomExams(allExams, 3);
    const userResponse = await axios.get(buildApiUrl(API_ENDPOINTS.ACCOUNTS));
    const users = userResponse.data;
    const idUserLogin = typeof window !== "undefined" ? localStorage.getItem("keyLogin") : null;
    currentUser.value = idUserLogin ? users.find((user) => user.id === idUserLogin) : null;

    // Fetch comments for the current exam
    const commentsResponse = await axios.get(buildApiUrl(API_ENDPOINTS.COMMENTS_BY_EXAM(examId.value)));
    comments.value = commentsResponse.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

// Utility function to get random exams without duplicates
function getRandomExams(exams, count) {
  const shuffled = exams.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const handleAddOrUpdateComment = async () => {
  if (newComment.value.trim() === "") return;
  
  const { buildApiUrl, API_ENDPOINTS } = await import('@/utils/api.js');

  if (editingCommentId.value) {
    // Update existing comment
    await axios.put(buildApiUrl(`/comments/${editingCommentId.value}`), {
      content: newComment.value,
      date: new Date().toISOString(),
    });
    editingCommentId.value = null;
  } else {
    // Add new comment
    await axios.post(buildApiUrl(API_ENDPOINTS.COMMENTS), {
      idExam: examId.value,
      idUser: currentUser.value.id,
      content: newComment.value,
      date: new Date().toISOString(),
    });
  }
  newComment.value = "";
  const commentsResponse = await axios.get(buildApiUrl(API_ENDPOINTS.COMMENTS_BY_EXAM(examId.value)));
  comments.value = commentsResponse.data;
};

const handleDeleteComment = (commentId) => {
  Swal.fire({
    title: "Bạn có chắc muốn xóa bình luận?",
    text: "Bạn sẽ không thể hoàn tác hành động này!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy bỏ",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await axios.delete(`http://localhost:3000/comments/${commentId}`);
      Swal.fire("Đã xóa bình luận!", "", "success");

      // Refresh comments after deletion
      const commentsResponse = await axios.get(`http://localhost:3000/comments?examId=${examId.value}`);
      comments.value = commentsResponse.data;
    }
  });
};
const toggleShowComments = () => {
  showAllComments.value = !showAllComments.value;
};
const displayedComments = computed(() => {
  return showAllComments.value ? comments.value : comments.value.slice(0, 3);
});
const editComment = (comment) => {
  editingCommentId.value = comment.id;
  newComment.value = comment.content;
};
</script>
  <style scoped>
</style>
  