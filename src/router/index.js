import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import PokemonDetail from '../views/PokemonDetail.vue';
import Favorites from '../views/Favorites.vue';
import Compare from '../views/Compare.vue';
import About from '../views/About.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/pokemon/:idOrName',
    name: 'PokemonDetail',
    component: PokemonDetail,
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
  },
  {
    path: '/compare',
    name: 'Compare',
    component: Compare,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: 'smooth' };
  },
});

export default router;