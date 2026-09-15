import { onMounted, onUnmounted, ref, watch } from 'vue';

/**
 * Observes an element for viewport proximity and visibility.
 *
 * @returns {{
 *   target: import('vue').Ref<HTMLElement | null>,
 *   hasEntered: import('vue').Ref<boolean>,
 *   isVisible: import('vue').Ref<boolean>
 * }}
 */
export function useInViewport() {
  const target = ref(null);
  const hasEntered = ref(false);
  const isVisible = ref(false);

  /** @type {IntersectionObserver | null} */
  let enterObserver = null;
  /** @type {IntersectionObserver | null} */
  let visibilityObserver = null;

  function observe() {
    const el = target.value;
    if (!el) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      hasEntered.value = true;
      isVisible.value = true;
      return;
    }

    enterObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          hasEntered.value = true;
          enterObserver?.disconnect();
          enterObserver = null;
        }
      },
      { rootMargin: '400px 0px' }
    );
    enterObserver.observe(el);

    visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible.value = Boolean(entry?.isIntersecting);
      },
      { rootMargin: '0px' }
    );
    visibilityObserver.observe(el);
  }

  function disconnect() {
    enterObserver?.disconnect();
    enterObserver = null;
    visibilityObserver?.disconnect();
    visibilityObserver = null;
  }

  onMounted(() => {
    if (target.value) {
      observe();
    } else {
      const stop = watch(target, (el) => {
        if (el) {
          observe();
          stop();
        }
      });
    }
  });

  onUnmounted(() => {
    disconnect();
  });

  return { target, hasEntered, isVisible };
}
