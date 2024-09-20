<template>
  <header class="top-nav">
    <img
      src="../assets/images/home-icon.png"
      @click="openHome"
      alt=""
      class="home-icon"
    />

    <img src="../assets/images/logo.png" @click="toHome" alt="" class="logo" />

    <img
      src="../assets/images/menu-icon.png"
      @click="showMenu"
      alt=""
      class="menu-icon"
    />

    <!-- <div
      class="link-wallt share-button button"
      v-if="!isLogin"
      @click="showLink = true"
    >
      Connect
    </div> -->

    <div class="home-more" v-show="showHome" @click="showHome = false">
      <div class="nav-list">
        <div
          class="nav-item"
          v-for="(item, index) in navList"
          :key="index"
          @click.stop="changeNav(item, index)"
        >
          {{ item.text }}
        </div>
        <!-- <div class="nav-item">Gameplay</div> -->
      </div>
    </div>

    <div class="menu-more" v-show="menuShow" @click="menuShow = false">
      <div class="menu-list" @click.stop="">
        <div class="menu-item">
          <div class="button" @click="openInvite">Invite</div>
        </div>
        <div
          class="menu-item"
          v-for="(item, index) in moreList"
          :key="index"
          @click="toModule(index)"
        >
          <div class="left">
            <img :src="item.icon" alt="" class="icon" />
            {{ item.title }}
          </div>
          <div class="right" v-if="index !== 2">{{ item.value }}</div>
          <div class="right" v-else>
            <p
              style="margin: 0 0.01rem; font-size: 0.32rem; font-weight: 600"
              v-for="(it, idx) in item.value"
              :key="idx"
            >
              {{ it }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="left">
      <img src="../assets/images/logo.png" alt="" class="logo" />
      <div class="nav-list">
        <div
          class="nav-item"
          :class="{ active: currentIndex === index }"
          v-for="(item, index) in navList"
          @click="changeNav(item, index)"
          :key="index"
        >
          {{ item.text }}
        </div>
      </div>
    </div>

    <div class="right">
      <div
        class="link-wallt share-button button"
        v-if="!isLogin"
        @click="showLink = true"
      >
        Connect
      </div>
      <div class="detail" v-if="isLogin">
        <div class="share-button" @click="openInvite">Invite</div>
        <div class="score-box" @click="toScore">
          <img src="../assets/images/score-icon.png" alt="" class="icon" />
          <p class="text">{{ userInfo.integral }}</p>
        </div>
        <div class="user-info">
          <p class="name">{{ userName }}</p>

          <div class="more-box">
            <div class="more-list">
              <div
                class="more-item"
                v-for="(item, index) in moreList"
                :key="index"
                @click="toModule(index)"
              >
                <div class="left">
                  <img :src="item.icon" alt="" class="icon" />
                  <p class="text">{{ item.title }}</p>
                </div>
                <div class="value" v-if="index === 2">
                  <p
                    style="margin: 0 1px; font-size: 16px; font-weight: 600;"
                    v-for="(it, idx) in item.value"
                    :key="idx"
                  >
                    {{ it }}
                  </p>

                  <div class="share-button" @click="copyInvite">Copy</div>
                </div>
                <div class="value" v-else>{{ item.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div> -->
    <Link-Wallet v-model="showLink" @success="finishLogin" />
  </header>
</template>
<script>
import api from "@/utils/api";
import LinkWallet from "./LinkWallet.vue";
export default {
  components: { LinkWallet },
  data() {
    return {
      menuShow: false,
      showHome: false,
      showLink: false,
      isLogin: false,
      navList: [
        { link: "/", text: "Home" },
        { link: "/desc", text: "Gameplay" },
        { link: "/history", text: "Prize History" },
        { link: "/mall", text: "Points Mall" },
      ],
      userName: "",
      currentIndex: 0,
      moreList: [
        {
          title: "Address",
          icon: require("../assets/images/wallet.png"),
          value: "Kevin@gmail.com",
        },
        {
          title: "Points",
          icon: require("../assets/images/score-small.png"),
          value: "2056",
        },
        {
          title: "Invite Code",
          icon: require("../assets/images/invite.png"),
          value: "666",
        },
        {
          title: "Number of invitees",
          icon: require("../assets/images/invite-count.png"),
          value: "36",
        },
        {
          title: "Disconnect",
          icon: require("../assets/images/disconnect.png"),
          value: "",
        },
      ],
      userInfo: {},
    };
  },
  watch: {
    $route(val) {
      this.initActive();
    },
  },
  created() {
    this.initActive();
    this.isLogin = localStorage.getItem("TOKEN");
    if (this.isLogin) {
      this.setUserName();
    }

    this.$EventBus.$on("openWalletLink", () => {
      this.showLink = true;
    });
  },
  methods: {
    toHome() {
      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
    },
    openHome() {
      this.menuShow = false;
      this.showLink = false;
      this.showHome = true;
    },
    showMenu() {
      this.showHome = false;
      if (this.isLogin) {
        this.menuShow = true;
      } else {
        this.showLink = true;
      }
    },
    async copyInvite() {
      await navigator.clipboard.writeText(this.moreList[2].value.join(""));
      this.$toast("Copied!");
    },
    async getUserInfo() {
      const data = await api.getUserInfo({});
      if (data.code === 200) {
        this.userInfo = data.data;
        this.moreList[0].value =
          data.data.address.substring(0, 6) +
          "..." +
          data.data.address.substring(data.data.address.length - 4);
        this.moreList[1].value = data.data.integral;
        this.moreList[2].value = data.data.invitationCode.split("");
        this.moreList[3].value = data.data.invitationNum;
        console.log(data.data.invitationCode.split(""));

        this.$emit("changeUserInfo", this.userInfo);
      }
    },
    setUserName() {
      if (localStorage.getItem("ADDRESS")) {
        this.userName =
          localStorage.getItem("ADDRESS").substring(0, 6) +
          "..." +
          localStorage
            .getItem("ADDRESS")
            .substring(localStorage.getItem("ADDRESS").length - 4);
        this.moreList[0].value = this.userName;
      }

      this.$EventBus.$emit("refreshHistory", {});

      this.getUserInfo();
    },
    finishLogin() {
      this.isLogin = true;
      this.setUserName();
    },

    openInvite() {
      this.menuShow = false;
      this.$emit("openInvite");
    },
    async toModule(index) {
      if (index === 1) {
        this.toScore();
        this.menuShow = false;
      } else if (index === 4) {
        localStorage.setItem("TOKEN", "");
        localStorage.setItem("ADDRESS", "");
        this.isLogin = false;
        this.$EventBus.$emit("logout", {});
        this.menuShow = false;
      } else if (index === 2) {
        await navigator.clipboard.writeText(this.moreList[2].value.join(""));
        this.$toast("Copied!");
        this.menuShow = false;
      }
    },
    toScore() {
      if (this.$route.path === "/score-history") {
        return;
      }
      this.$router.push("/score-history");
    },
    initActive() {
      const index = this.navList.findIndex(
        (item) => item.link === this.$route.path
      );
      this.currentIndex = index;
    },
    changeNav(item, index) {
      if (this.$route.path === this.navList[index].link) {
        return;
      }
      this.showHome = false;
      this.currentIndex = index;
      this.$router.push(item.link);
    },
  },
};
</script>
<style lang="less" scoped>
.top-nav {
  height: 1.2rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.32rem;
  box-sizing: border-box;
  background-color: #101729;
  position: relative;
  z-index: 99;

  .home-icon,
  .menu-icon {
    width: 0.48rem;
  }

  .logo {
    width: 1.72rem;
  }

  .share-button {
    box-sizing: border-box;
    color: #5ffe99;
    font-size: 0.24rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .home-more,
  .menu-more {
    position: fixed;
    left: 0;
    top: 1.2rem;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);

    .nav-list,
    .menu-list {
      padding: 0.32rem 0.32rem;
      background-color: #1a2540;
      border-radius: 0px 0px 0.4rem 0.4rem;

      .nav-item,
      .menu-item {
        color: #7a89b0;
        font-size: 0.32rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 0.3rem;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .menu-list {
      .menu-item {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:first-child {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .button {
          padding: 0 0.4rem;
          height: 0.72rem;
          background: #081024;
          border-radius: 0.2rem;
          border: 0.02rem solid #1e2c4f;
          font-size: 0.28rem;
          color: #5ffe99;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }

        .left {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          color: #fff;
          font-size: 0.28rem;

          .icon {
            width: 0.4rem;
            margin-right: 0.16rem;
          }
        }

        .right {
          color: #8499cd;
          font-size: 0.28rem;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      }
    }
  }
}
</style>