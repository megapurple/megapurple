<template>
  <div id="app">
    <top-nav
      @openInvite="openInvite"
      @changeUserInfo="changeUserInfo"
    ></top-nav>
    <router-view :userInfo="userInfo" />

    <Invite v-model="showInvite" :userInfo="userInfo" />
    <div class="service-list">
      <img
        @click="openLink('https://x.com/megaplofficial?s=21')"
        src="./assets/images/twitter-icon.png"
        alt=""
        class="service-item"
      />
      <img
        @click="openLink('https://discord.gg/wd6MsnXMzR')"
        src="./assets/images/discord-icon.png"
        alt=""
        class="service-item"
      />
      <!-- <img src="./assets/images/mega-icon.png" alt="" class="service-item" /> -->
      <img
        @click="openLink('https://t.me/Purpleballofficial')"
        src="./assets/images/telegram-icon.png"
        alt=""
        class="service-item"
      />
      <img  @click="openLink('https://docs.purpleball.io/')" src="./assets/images/mega-icon.png" alt="" class="service-item" />
    </div>
  </div>
</template>
<script>
import TopNav from "./components/TopNav.vue";
import Invite from "./components/Invite.vue";
export default {
  components: { TopNav, Invite },
  data() {
    return {
      showInvite: false,
      userInfo: {},
    };
  },
  methods: {
    openLink(url) {
      window.open(url);
    },
    openInvite() {
      this.showInvite = true;
    },
    changeUserInfo(payload) {
      this.userInfo = payload;
    },
  },
};
</script>
<style lang="less">
#app {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif,
    "Microsoft Yahei";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.service-list {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-75px);
  background: #1a2540;
  border-radius: 30px 30px 30px 30px;
  width: 60px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .service-item {
    width: 30px;
    margin-bottom: 10px;
    cursor: pointer;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

html,
body,
#app {
  margin: 0;
  width: 100%;
  height: 100%;
  background-color: #030b1e;
}

@font-face {
  font-family: "number";
  src: url(./assets/font/Azonix.otf);
}

p {
  margin: 0;
}

.main {
  height: calc(100% - 60px);
  overflow-y: auto;

  .content {
    width: 1000px;
    margin: 0 auto;
    max-width: 100%;
  }
}

// 滚动条整体宽度
::-webkit-scrollbar {
  width: 8px;
}
// 滚动条滑槽样式
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  border-radius: 8px;
}
// 滚动条样式
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: #ddd;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
::-webkit-scrollbar-thumb:active {
  background: #999;
}
// 浏览器失焦的样式
::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(255, 0, 0, 0.4);
}

.mask {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  .loading-box {
    .text {
      margin-top: 50px;
      color: #fff;
    }
  }
}

.loading {
  width: 80px;
  height: 40px;
  margin: 0 auto;
  margin-top: 100px;
}
.loading span {
  display: inline-block;
  width: 8px;
  height: 100%;
  border-radius: 4px;
  background: lightgreen;
  -webkit-animation: load 1s ease infinite;
  margin-right: 8px;
}
@keyframes load {
  0%,
  100% {
    height: 40px;
    background: lightgreen;
  }
  50% {
    height: 70px;
    margin-top: -15px;
    margin-bottom: -15px;
    background: lightblue;
  }
}
.loading span:nth-child(2) {
  -webkit-animation-delay: 0.2s;
}
.loading span:nth-child(3) {
  -webkit-animation-delay: 0.4s;
}
.loading span:nth-child(4) {
  -webkit-animation-delay: 0.6s;
}
.loading span:nth-child(5) {
  -webkit-animation-delay: 0.8s;
}
</style>
