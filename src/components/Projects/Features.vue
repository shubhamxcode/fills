<template>
  <section id="features" class="features-section py-12 sm:py-24 px-4 sm:px-8 relative overflow-hidden">
    <div class="max-w-7xl mx-auto relative">
      <Transition
        appear
        enter-active-class="transition duration-1000"
        enter-from-class="opacity-0 translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div class="text-center mb-8 sm:mb-16">
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Our Solutions Portfolio
          </h2>
          <p class="mt-3 sm:mt-4 text-lg sm:text-xl text-gray-400">
            Innovative AI solutions across multiple industries
          </p>
        </div>
      </Transition>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
        <TransitionGroup
          appear
          enter-active-class="transition duration-1000"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            :style="{ 
              transitionDelay: `${index * 200}ms`,
              transform: `
                perspective(2000px)
                rotateY(${mousePos[index].x * 0.05}deg)
                rotateX(${-mousePos[index].y * 0.05}deg)
                translateZ(${mousePos[index].isHovered ? '20px' : '0px'})
              `,
              transition: 'transform 0.3s ease'
            }"
            class="group relative"
            @mousemove="handleMouseMove($event, index)"
            @mouseenter="handleMouseEnter(index)"
            @mouseleave="handleMouseLeave(index)"
          >
            <!-- Glowing background -->
            <div 
              class="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-cyan-500/30 rounded-xl blur-xl transition-opacity duration-500"
              :style="{
                opacity: mousePos[index].isHovered ? 1 : 0,
                transform: `translate(${mousePos[index].x * 0.1}px, ${mousePos[index].y * 0.1}px)`
              }"
            ></div>

            <!-- Card Content -->
            <div
              class="relative bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-700/50 transition-all duration-300 group-hover:border-emerald-500/50 group-hover:shadow-2xl group-hover:shadow-emerald-500/20 h-[350px] sm:h-[400px] flex flex-col"
            >
              <!-- 3D floating icon -->
              <div 
                class="h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 mb-4 sm:mb-6 p-2 sm:p-3 transition-transform duration-300"
                :style="{
                  transform: `
                    translateZ(40px)
                    rotateY(${mousePos[index].x * 0.1}deg)
                    rotateX(${-mousePos[index].y * 0.1}deg)
                  `
                }"
              >
                <component :is="feature.icon" class="w-full h-full text-white" />
              </div>

              <!-- Text content with 3D effect -->
              <div
                :style="{
                  transform: `
                    translateZ(30px)
                    rotateY(${mousePos[index].x * 0.03}deg)
                    rotateX(${-mousePos[index].y * 0.03}deg)
                  `
                }"
              >
                <h3 class="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">{{ feature.title }}</h3>
                <p class="text-sm sm:text-base text-gray-400">{{ feature.description }}</p>
              </div>

              <!-- Interactive Element with enhanced 3D -->
              <div 
                class="mt-auto pt-4 sm:pt-6"
                :style="{
                  transform: `
                    translateZ(50px)
                    rotateY(${mousePos[index].x * 0.08}deg)
                    rotateX(${-mousePos[index].y * 0.08}deg)
                  `
                }"
              >
                <component 
                  :is="feature.interactive" 
                  v-bind="feature.props || {}"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, h, onMounted } from 'vue';

// Mouse position for each card
const mousePos = ref(Array(8).fill().map(() => ({ x: 0, y: 0, isHovered: false })));

const handleMouseMove = (event, index) => {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const x = (event.clientX - centerX) / 10;
  const y = (event.clientY - centerY) / 10;
  mousePos.value[index] = { ...mousePos.value[index], x, y };
};

const handleMouseEnter = (index) => {
  mousePos.value[index].isHovered = true;
};

const handleMouseLeave = (index) => {
  mousePos.value[index] = { x: 0, y: 0, isHovered: false };
};

// Interactive components with enhanced 3D effects
const TypeWriter = {
  setup() {
    const phrases = [
      'Vue.js',
      'Components',
      'Reactivity',
      'Performance'
    ];
    const currentText = ref('');
    const phraseIndex = ref(0);
    const charIndex = ref(0);
    const isDeleting = ref(false);
    const isPaused = ref(false);

    const typeEffect = () => {
      const currentPhrase = phrases[phraseIndex.value];
      
      if (!isDeleting.value) {
        currentText.value = currentPhrase.substring(0, charIndex.value + 1);
        charIndex.value++;
        
        if (charIndex.value === currentPhrase.length) {
          isDeleting.value = true;
          isPaused.value = true;
          setTimeout(() => {
            isPaused.value = false;
          }, 1500);
        }
      } else {
        if (!isPaused.value) {
          currentText.value = currentPhrase.substring(0, charIndex.value - 1);
          charIndex.value--;
          
          if (charIndex.value === 0) {
            isDeleting.value = false;
            phraseIndex.value = (phraseIndex.value + 1) % phrases.length;
          }
        }
      }
      
      const speed = isDeleting.value ? 50 : 150;
      if (!isPaused.value) {
        setTimeout(typeEffect, speed);
      } else {
        setTimeout(typeEffect, 1500);
      }
    };

    onMounted(() => {
      typeEffect();
    });

    return () => h('div', { 
      class: 'flex flex-col items-center gap-2' 
    }, [
      h('div', { 
        class: 'text-2xl font-mono text-emerald-400 min-h-[2em] flex items-center' 
      }, [
        currentText.value,
        h('span', { 
          class: 'w-[2px] h-6 bg-emerald-400 ml-1 animate-pulse' 
        })
      ])
    ]);
  }
};

const ThemeSwitcher = {
  setup() {
    const themes = [
      { name: 'Emerald', from: 'from-emerald-500', to: 'to-teal-500' },
      { name: 'Purple', from: 'from-purple-500', to: 'to-pink-500' },
      { name: 'Blue', from: 'from-blue-500', to: 'to-cyan-500' }
    ];
    const currentTheme = ref(0);

    return () => h('div', { class: 'space-y-4' }, [
      // Gradient preview box
      h('div', {
        class: `h-24 rounded-xl transition-all duration-500 bg-gradient-to-r ${themes[currentTheme.value].from} ${themes[currentTheme.value].to} bg-opacity-20`
      }),

      // Button Container
      h('div', {
        class: 'flex justify-center gap-2 flex-wrap items-center'
      }, themes.map((theme, index) =>
        h('button', {
          class: `px-4 py-1 rounded-lg text-sm transition-all duration-300 w-auto max-w-full truncate whitespace-nowrap
            ${
              currentTheme.value === index
                ? `bg-gradient-to-r ${theme.from} ${theme.to} text-white shadow-md`
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`,
          onClick: () => (currentTheme.value = index)
        }, theme.name)
      ))
    ]);
  }
};


const ProgressBar = {
  props: ['value', 'max'],
  setup(props) {
    const progress = computed(() => (props.value / props.max) * 100);
    return () => h('div', { 
      class: 'h-3 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm' 
    }, [
      h('div', {
        class: 'h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-700 ease-out',
        style: { width: `${progress.value}%` }
      })
    ]);
  }
};

const AnimatedCounter = {
  setup() {
    const count = ref(0);
    return () => h('button', {
      class: 'w-full px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 rounded-xl text-emerald-400 transition-colors backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40',
      onClick: () => count.value++
    }, `Interactions: ${count.value}`);
  }
};

const LiveDemo = {
  setup() {
    const position = ref({ x: 50, y: 50 });
    const isDragging = ref(false);
    
    const handleMouseDown = () => isDragging.value = true;
    const handleMouseUp = () => isDragging.value = false;
    const handleMouseMove = (e) => {
      if (!isDragging.value) return;
      const rect = e.currentTarget.getBoundingClientRect();
      position.value = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      };
    };

    return () => h('div', {
      class: 'relative h-24 bg-gray-700/30 rounded-xl overflow-hidden backdrop-blur-sm border border-gray-600/30',
      onMousedown: handleMouseDown,
      onMouseup: handleMouseUp,
      onMousemove: handleMouseMove,
      onMouseleave: handleMouseUp
    }, [
      h('div', {
        class: 'absolute w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110',
        style: {
          left: `${position.value.x}%`,
          top: `${position.value.y}%`
        }
      })
    ]);
  }
};

// Feature definitions
const features = [
  {
    title: "Protein Production AI",
    description: "AI-driven system that optimizes each step of protein production, from raw material processing to final output, enhancing yield and quality while reducing costs and waste.",
    icon: {
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      `
    },
    interactive: TypeWriter
  },
  {
    title: "Valmiki AI: Granthālayah",
    description: "Digital repository providing authenticated access to Ramayana content with user portals, community features, and advanced search tools for preserving cultural knowledge.",
    icon: {
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      `
    },
    interactive: ThemeSwitcher
  },
  {
    title: "Valmiki AI: Duta",
    description: "Conversational AI assistant that answers Ramayana-related queries, creates personalized learning pathways, and supports multilingual interactions for interactive learning.",
    icon: {
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      `
    },
    interactive: LiveDemo
  },
  {
    title: "Valmiki AI: Dhvani",
    description: "Voice-activated learning platform offering audio narration of Ramayana stories and interactive voice-based sessions accessible through smart devices.",
    icon: {
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      `
    },
    interactive: TypeWriter
  },
  {
    title: "Medical AI Assistant",
    description: "Healthcare documentation tool that converts spoken notes into structured text, automatically populates medical forms, and integrates with existing EHR systems to reduce administrative burden.",
    icon: {
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
      `
    },
    interactive: ThemeSwitcher
  },
  {
    title: "Gap Shopping Assistant",
    description: "Retail AI solution providing personalized product recommendations, answering customer queries, checking inventory, and offering styling advice across multiple shopping channels.",
    icon: {
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      `
    },
    interactive: LiveDemo
  },
  {
    title: "Petsmart AI Assistant",
    description: "Pet-focused virtual assistant recommending products based on pet specifications, providing care information, and assisting with service scheduling for comprehensive pet owner support.",
    icon: {
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
        </svg>
      `
    },
    interactive: TypeWriter
  },
  {
    title: "Williams-Sonoma AI Assistant",
    description: "Culinary retail guide offering product information, recipe suggestions, gift recommendations, and cooking technique guidance to enhance the kitchenware shopping experience.",
    icon: {
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
      `
    },
    interactive: ThemeSwitcher
  }
];
</script>
