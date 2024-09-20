<template>
  <div class="prize-mask" v-show="value">
    <div class="prize-box">
      <div class="title">
        Results record
        <img
          @click="close"
          src="../assets/images/close-icon.png"
          class="close"
          alt=""
        />
      </div>
      <div class="prize-main">
        <div
          class="result-box"
          v-for="(item, index) in historyList"
          :key="index"
        >
          <div class="result-title">
            No.{{ item.phase }} {{ item.time }}
            <p class="more" @click="openDetail(item)">
              Public announcement
              <img src="../assets/images/more-icon.png" alt="" />
            </p>
          </div>
          <div class="result-list">
            <div
              class="result-item"
              v-for="(it, idx) in item.result"
              :key="idx"
            >
              {{ it }}
            </div>
          </div>
        </div>

        <div class="button" @click="more" v-show="isMore">More</div>
      </div>
    </div>

    <div class="mask" v-show="isLoading">
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
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      historyList: [],
      currentPage: 1,
      isMore: false,
      isLoading: false,
    };
  },
  created() {
    this.getPrizeList();
  },
  methods: {
    async getPrizeList() {
      this.isLoading = true;
      const data = await api.getPrizeList({
        pageNum: this.currentPage,
        pageSize: 4,
      });
      this.isLoading = false;

      if (data.code === 200) {
        this.historyList = this.historyList.concat(
          data.data.map((item) => {
            item.prizeTime = item.phase || "";
            item.phase = item.phase || "";
            item.time = `${item.phase.substring(6)}/${item.phase.substring(
              4,
              6
            )}/${item.phase.substring(0, 4)}`;
            item.result = [
              item.prizeOne,
              item.prizeTwo,
              item.prizeThree,
              item.prizeFour,
            ];
            return item;
          })
        );
        this.isMore = data.data.length === 4;
      }
    },
    more() {
      this.currentPage += 1;
      this.getPrizeList();
      // this.historyList = this.historyList.concat(this.historyList);
    },
    openDetail(item) {
      this.$emit("detail", item);
    },
    close() {
      this.$emit("input", false);
    },
  },
};
</script>
  <style lang="less" scoped>
.prize-mask {
  position: fixed;
  left: 0;

  top: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;

  .prize-box {
    width: 1000px;
    background-color: #101729;
    border-radius: 30px;
    overflow: hidden;

    .title {
      height: 74px;
      line-height: 74px;
      padding: 0 30px;
      background-color: #1a2540;
      text-align: left;
      color: #fff;
      font-size: 24px;
      position: relative;

      .close {
        width: 30px;
        position: absolute;
        right: 30px;
        top: 22px;
        cursor: pointer;
      }
    }

    .prize-main {
      padding: 20px 100px 30px;
      max-height: 660px;
      overflow-y: auto;

      .button {
        width: 88px;
        height: 36px;
        background: #081024;
        border-radius: 10px 10px 10px 10px;
        border: 1px solid #1e2c4f;
        font-size: 14px;
        color: #5ffe99;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        cursor: pointer;
      }

      .result-box {
        margin-bottom: 40px;
      }

      .result-title {
        font-size: 18px;
        color: #8499cd;
        margin-bottom: 10px;
        position: relative;
        line-height: 24px;

        .more {
          position: absolute;
          right: 0;
          top: 0;
          height: 24px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          cursor: pointer;

          img {
            margin-left: 8px;
            width: 16px;
          }
        }
      }

      .result-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 42px;

        .result-item {
          width: 74px;
          height: 74px;
          background: #17213d;
          box-shadow: inset -1px -4px 11px 0px #182e66;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #e14545;
          font-size: 36px;
          font-family: "number";
          border-radius: 50%;

          &:last-child {
            color: #9b4ad1;
          }
        }
      }
    }
  }
}
</style>