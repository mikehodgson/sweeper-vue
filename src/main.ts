import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'

const i18n = createI18n({
  legacy: false,
  locale: navigator.language.split('-')[0],
  fallbackLocale: 'en',
  messages: {
    en: {
      title: 'Sweeper',
      new_game: 'New Game',
      game_over: 'Game Over!',
    },
    fr: {
      title: 'Démineur',
      new_game: 'Nouvelle partie',
      game_over: 'Jeu terminé!',
    },
    es: {
      title: 'Buscaminas',
      new_game: 'Nuevo juego',
      game_over: '¡Juego terminado!',
    },
    ja: {
      title: 'マインスイーパ',
      new_game: '新しいゲーム',
      game_over: 'ゲームオーバー！',
    },
    zh: {
      title: '扫雷',
      new_game: '新游戏',
      game_over: '游戏结束！',
    },
    pa: {
      title: 'ਸਵੀਪਰ',
      new_game: 'ਨਵਾਂ ਖੇਡ',
      game_over: 'ਖੇਡ ਖਤਮ!',
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(i18n)

app.mount('#app')
