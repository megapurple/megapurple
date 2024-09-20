<template>
  <header class="top-nav">
    <div class="left">
      <img
        src="../assets/images/logo.png"
        @click="toHome"
        alt=""
        class="logo"
      />
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
          <!-- <img src="../assets/images/avatar-icon.png" alt="" class="avatar" /> -->
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
                    style="margin: 0 1px; font-size: 16px; font-weight: 600"
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

      <Link-Wallet v-model="showLink" @success="finishLogin" />
    </div>
  </header>
</template>
<script>
import api from "@/utils/api";
import LinkWallet from "./LinkWallet.vue";
export default {
  components: { LinkWallet },
  data() {
    return {
      showLink: false,
      isLogin: false,
      navList: [
        { link: "/", text: "Home" },
        { link: "/desc", text: "Gameplay" },
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

    this.$EventBus.$on("openWalletLink", (data) => {
      this.showLink = true;
    });
  },
  methods: {
    toHome() {
      if (this.$route.path !== "/") {
        this.$router.push("/");
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
      this.$emit("openInvite");
    },
    toModule(index) {
      if (index === 1) {
        this.toScore();
      } else if (index === 4) {
        localStorage.setItem("TOKEN", "");
        localStorage.setItem("ADDRESS", "");
        this.isLogin = false;
        this.$EventBus.$emit("logout", {});
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
      this.currentIndex = index;
      this.$router.push(item.link);
    },
  },
};
</script>
<style lang="less" scoped>
.top-nav {
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  box-sizing: border-box;
  background-color: #101729;
  position: relative;
  z-index: 99;

  .left {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .logo {
      width: 144px;
      margin-right: 40px;
    }

    .nav-list {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .nav-item {
        width: 100px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #7a89b0;
        font-size: 14px;
        cursor: pointer;

        &.active {
          background-color: #030b1e;
          position: relative;
          cursor: default;

          &::after {
            width: 100%;
            height: 2px;
            background-color: #5ffe99;
            content: " ";
            position: absolute;
            left: 0;
            bottom: 0;
          }
        }
      }
    }
  }

  .right {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 60px;

    .detail {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 60px;
    }

    .share-button {
      width: 60px;
      height: 36px;
      background: #081024;
      border-radius: 10px;
      border: 1px solid #1e2c4f;
      box-sizing: border-box;
      color: #5ffe99;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 30px;
      cursor: pointer;

      &.button {
        margin-right: 0;
        width: unset;
        padding: 0 24px;
      }
    }

    .score-box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-right: 30px;
      cursor: pointer;

      .icon {
        width: 26px;
        margin-right: 4px;
      }

      .text {
        color: #fff;
        font-size: 18px;
        font-family: "number";
      }
    }

    .user-info {
      padding-left: 30px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      height: 60px;

      &:hover {
        .more-box {
          display: flex;
        }
      }

      &::after {
        position: absolute;
        left: 0;
        top: 15px;
        width: 1px;
        height: 30px;
        background-color: #33436a;
        content: " ";
      }

      .avatar {
        width: 26px;
        margin-right: 6px;
      }

      .name {
        color: #fff;
        font-size: 14px;
      }
    }
  }

  .more-box {
    position: absolute;
    top: 60px;
    right: 0;
    padding: 30px;
    background: #1a2540;
    border-radius: 20px;
    display: none;

    .more-list {
      .more-item {
        width: 340px;
        height: 40px;
        padding: 0 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        &:nth-child(2),
        &:nth-child(5) {
          cursor: pointer;
        }

        &:last-child {
          margin-bottom: 0;
        }

        .left {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .icon {
            width: 20px;
            margin-right: 8px;
          }

          .text {
            color: #fff;
            font-size: 14px;
          }
        }

        .value {
          color: #8499cd;
          font-size: 14px;
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;

          .share-button {
            margin-right: 0;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>