<template>
  <div>
    <section class="attend-banner">
      <h1 class="attend-title text-center bg-blue-400 text-black font-bold rounded-lg py-4 mb-6">
        Hãy đăng kí khóa học cùng chúng tôi
      </h1>
      
      <!-- Custom Carousel with Tailwind -->
      <div class="relative w-full h-96 md:h-[600px] overflow-hidden rounded-lg">
        <!-- Slides -->
        <div 
          class="flex transition-transform duration-500 ease-in-out h-full"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div 
            v-for="(slide, index) in slides" 
            :key="index"
            class="w-full h-full flex-shrink-0"
          >
            <img
              :src="slide.image"
              :alt="slide.alt"
              class="w-full h-full object-cover"
            />
            <div v-if="slide.caption" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h3 class="text-white text-xl font-bold mb-2">{{ slide.caption.title }}</h3>
              <p class="text-white/90">{{ slide.caption.description }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button
          @click="previousSlide"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <button
          @click="nextSlide"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <i class="fas fa-chevron-right"></i>
        </button>

        <!-- Indicators -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <button
            v-for="(slide, index) in slides"
            :key="index"
            @click="goToSlide(index)"
            :class="[
              'w-3 h-3 rounded-full transition-all duration-200',
              currentSlide === index 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/70'
            ]"
            :aria-label="`Go to slide ${index + 1}`"
          ></button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Slides data
const slides = ref([
  {
    image: 'https://hocmai.vn/media/images/home/desktop/ban-sao-cua-122banner-webhuyendvt-1.png',
    alt: 'Khóa học 1',
    caption: {
      title: 'Học tập hiệu quả',
      description: 'Phương pháp học tập tiên tiến với công nghệ AI'
    }
  },
  {
    image: 'https://hocmai.vn/media/images/home/desktop/ban-sao-cua-121banner-webphuongpa-1.png',
    alt: 'Khóa học 2',
    caption: {
      title: 'Giáo viên chuyên nghiệp',
      description: 'Đội ngũ giáo viên giàu kinh nghiệm và tâm huyết'
    }
  },
  {
    image: 'https://hocmai.vn/media/images/home/desktop/222banner-webannpb-l-715-x-400-1.png',
    alt: 'Khóa học 3',
    caption: {
      title: 'Kết quả vượt trội',
      description: 'Hàng nghìn học viên đã đạt điểm cao nhờ phương pháp của chúng tôi'
    }
  }
])

const currentSlide = ref(0)
let autoSlideInterval = null

// Navigation methods
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const previousSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? slides.value.length - 1 
    : currentSlide.value - 1
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// Auto-slide functionality
const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    nextSlide()
  }, 4000) // Change slide every 4 seconds
}

const stopAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
    autoSlideInterval = null
  }
}

// Lifecycle hooks
onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})

// Pause auto-slide on hover
const pauseAutoSlide = () => stopAutoSlide()
const resumeAutoSlide = () => startAutoSlide()
</script>

<style scoped>
</style>
