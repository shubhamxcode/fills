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
            Experience The Power Of Fills
          </h2>
          <p class="mt-3 sm:mt-4 text-lg sm:text-xl text-gray-400">Cutting-edge Projects that sets fills ai apart</p>
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
            :style="mousePos ? { 
              transitionDelay: `${index * 200}ms`,
              transform: mousePos[index].isHovered 
                ? `
                  perspective(2000px)
                  rotateY(${mousePos[index].x * 0.05}deg)
                  rotateX(${-mousePos[index].y * 0.05}deg)
                  translateZ(20px)
                  translateY(-8px)
                `
                : 'translateY(0px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            } : {}"
            class="group relative hover:shadow-xl"
            @mousemove="handleMouseMove($event, index)"
            @mouseenter="handleMouseEnter(index)"
            @mouseleave="handleMouseLeave(index)"
          >
            <!-- Glowing background -->
            <div 
              class="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-cyan-500/30 rounded-xl blur-xl transition-opacity duration-500"
              :style="{
                opacity: mousePos && mousePos[index].isHovered ? 1 : 0,
                transform: mousePos ? `translate(${mousePos[index].x * 0.1}px, ${mousePos[index].y * 0.1}px)` : ''
              }"
            ></div>

            <!-- Card Content -->
            <div
              class="relative bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-700/50 transition-all duration-300 group-hover:border-emerald-500/50 group-hover:shadow-2xl group-hover:shadow-emerald-500/20 h-[350px] sm:h-[400px] flex flex-col"
            >
              <!-- 3D floating icon -->
              <div 
                class="h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 mb-4 sm:mb-6 p-2 sm:p-3 transition-transform duration-300"
                :style="mousePos ? {
                  transform: `
                    translateZ(40px)
                    rotateY(${mousePos[index].x * 0.1}deg)
                    rotateX(${-mousePos[index].y * 0.1}deg)
                  `
                } : {}"
              >
                <component :is="feature.icon" class="w-full h-full text-white" />
              </div>

              <!-- Text content with 3D effect -->
              <div
                :style="mousePos ? {
                  transform: `
                    translateZ(30px)
                    rotateY(${mousePos[index].x * 0.03}deg)
                    rotateX(${-mousePos[index].y * 0.03}deg)
                  `
                } : {}"
              >
                <h3 class="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">{{ feature.title }}</h3>
                <p class="text-sm sm:text-base text-gray-400">{{ feature.description }}</p>
              </div>

              <!-- Interactive Element with enhanced 3D -->
              <div 
                class="mt-auto pt-4 sm:pt-6"
                :style="mousePos ? {
                  transform: `
                    translateZ(50px)
                    rotateY(${mousePos[index].x * 0.08}deg)
                    rotateX(${-mousePos[index].y * 0.08}deg)
                  `
                } : {}"
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

// Initialize mousePos with null instead of empty array
const mousePos = ref(null);

// Initialize the mousePos in onMounted
onMounted(() => {
  mousePos.value = Array(3).fill().map(() => ({ 
    x: 0, 
    y: 0, 
    isHovered: false 
  }));
});

const handleMouseMove = (event, index) => {
  if (!mousePos.value) return; // Add safety check
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const x = (event.clientX - centerX) / 10;
  const y = (event.clientY - centerY) / 10;
  mousePos.value[index] = { ...mousePos.value[index], x, y };
};

const handleMouseEnter = (index) => {
  if (!mousePos.value) return; // Add safety check
  mousePos.value[index].isHovered = true;
};

const handleMouseLeave = (index) => {
  if (!mousePos.value) return; // Add safety check
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
    title: "Valmiki AI",
    description: "An innovative AI platform that brings ancient wisdom to modern conversations, making spiritual knowledge accessible through interactive dialogue.",
    icon: {
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      `
    },
    interactive: TypeWriter
  },
  {
    title: "Medical AI Form Filler",
    description: "Streamlining healthcare documentation with AI-powered form completion, reducing administrative burden while maintaining accuracy and compliance.",
    icon: {
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      `
    },
    interactive: ThemeSwitcher
  },
  {
    title: "GAP Shopping AI Assistant",
    description: "A personalized shopping companion that helps customers find the perfect style, size, and fit while providing real-time fashion advice and recommendations.",
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
    title: "Pet Smart AI Assistant",
    description: "An intelligent companion for pet owners, offering personalized care advice, behavior insights, and health monitoring for their beloved animals.",
    icon: {
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
        </svg>
      `
    },
    interactive: AnimatedCounter
  },
  {
    title: "Williamson Sonoma AI Assistant",
    description: "A sophisticated culinary AI that helps customers discover kitchen essentials, recipes, and cooking techniques while providing personalized shopping recommendations.",
    icon: {
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
        </svg>
      `
    },
    interactive: ProgressBar,
    props: { value: 75, max: 100 }
  }
];
</script>
