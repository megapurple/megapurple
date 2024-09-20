<template>
  <div class="main" @scroll="more" ref="wrap">
    <div class="content" ref="content">
      <div class="score-box">
        <img src="../assets/images/score-bg.png" alt="" class="bg" />
        <div class="title">{{ score }}</div>
        <div class="sub-title">My points</div>
        <div class="second-title">Points Record</div>
        <div class="score-list">
          <div
            class="score-item"
            v-for="(item, index) in scoreList"
            :key="index"
            v-show="item.integral"
          >
            <div class="left">
              <p class="value" :class="{ yellow: item.type === 2 }">
                {{ item.symbol }}{{ item.integral }}
              </p>
              <p class="value last">{{ item.notes }}</p>
            </div>
            <div class="time">{{ item.createTime }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mask" v-show="isRequest">
      <div class="loading-box">
        <div class="loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div class="text">Loading...</div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/utils/api";

export default {
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      scoreList: [],
      currentPage: 1,
      isMore: true,
      isRequest: false,
      score: "",
    };
  },
  watch: {
    userInfo(val) {
      this.score = val.integral;
    },
  },
  created() {
    this.score = this.userInfo.integral || 0;
    this.getScoreList();
    this.$EventBus.$on("logout", (res) => {
      this.$router.push("/");
    });
  },
  methods: {
    more() {
      const wrap = this.$refs.wrap;
      const content = this.$refs.content;
      if (wrap.scrollTop + wrap.offsetHeight < content.offsetHeight - 100) {
        if (this.isMore && !this.isRequest) {
          this.currentPage += 1;
          this.getScoreList();
        }
      }
    },
    async getScoreList() {
      this.isRequest = true;
      const data = await api.getScoreList({
        pageNum: this.currentPage,
        pageSize: 10,
      });
      this.isRequest = false;

      if (data.code === 200) {
        data.data.forEach((item) => {
          item.symbol = `${item.type === 1 ? "+" : "-"}`;
          // item.remark = "Referral commission";
        });
        this.scoreList = this.scoreList.concat(data.data);
        this.isMore = data.data.length === 10;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  padding: 20px 0;
  .score-box {
    background: #101729;
    border-radius: 30px;
    padding: 68px 30px;
    position: relative;
    overflow: hidden;

    .bg {
      width: 185px;
      position: absolute;
      left: 0;
      top: 0;
    }

    .title {
      font-family: "number";
      font-size: 36px;
      color: #fff;
      margin-bottom: 10px;
    }

    .sub-title {
      color: #fff;
      font-size: 24px;
      margin-bottom: 72px;
    }

    .second-title {
      color: #fff;
      font-size: 18px;
      text-align: left;
      margin-bottom: 12px;
    }

    .score-list {
      .score-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 80px;
        padding: 0 30px;
        background: #1a2540;
        border-radius: 20px;
        margin-bottom: 10px;

        .left {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .icon {
            width: 48px;
            margin-right: 30px;
          }

          .value {
            color: #5ffe99;
            font-size: 24px;
            font-family: "number";

            &.last {
              margin-left: 20px;
            }

            &.yellow {
              color: #ffc710;
            }
          }
        }

        .time {
          color: #fff;
          font-size: 14px;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>