<template>
  <div class="welcome">
    <div class="container">
      <h1 class="effect1">{{ `欢迎使用${title}` }}</h1>
      <p class="text">have a nice day ☺</p>
    </div>

    <section>
      <div class="item"/>
      <div class="item"/>
      <div class="item"/>
      <div class="item"/>
      <div class="item"/>
      <div class="item"/>
      <div class="item"/>
      <div class="item"/>
      <div class="item"/>
      <div class="item"/>
    </section>
  </div>
</template>

<script>
import anime from 'animejs';
import defaultSettings from '@/settings';

export default {
  name: 'Home',
  data() {
    return {
      siteName: sessionStorage.getItem('siteName'),
      title: defaultSettings.title
    };
  },
  beforeRouteEnter(to, from, next) {
    const view = {
      fullPath: '/home',
      hash: '',
      matched: Array(2),
      meta: {
        icon: 'dashboard',
        title: '首页'
      },
      name: '首页',
      params: Object,
      path: '/home',
      query: Object,
      redirectedFrom: '/',
      title: '首页'
    };
  }
};
</script>
