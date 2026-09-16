import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/HistoryView.vue')
    },
    {
      path: '/players',
      name: 'players',
      component: () => import('@/views/PlayersView.vue')
    }
  ]
});

function isChunkLoadError(error) {
  const message = error?.message || String(error);
  return (
    /loading dynamically imported module/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    error?.name === 'ChunkLoadError'
  );
}

// After a redeploy, old hashed chunks 404. Force a full load of the new build.
router.onError((error, to) => {
  if (!isChunkLoadError(error)) return;

  const reloadKey = 'chunk-reload';
  const lastReload = Number(sessionStorage.getItem(reloadKey) || 0);
  if (Date.now() - lastReload < 10000) return;

  sessionStorage.setItem(reloadKey, String(Date.now()));
  window.location.assign(to.href);
});

export default router;
