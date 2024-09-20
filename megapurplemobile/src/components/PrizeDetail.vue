<template>
  <div class="prize-mask" v-show="value">
    <div class="prize-box">
      <div class="title">
        Public announcement
        <img
          @click="close"
          src="../assets/images/close-icon.png"
          class="close"
          alt=""
        />
      </div>
      <div class="prize-main">
        <div class="result-box">
          <div class="result-title">
            No.{{ detail.phase }} {{ detail.time }}
          </div>
          <div class="result-list">
            <div
              class="result-item"
              v-for="(it, idx) in detail.result"
              :key="idx"
            >
              {{ it }}
            </div>
          </div>
        </div>

        <div class="prize-list">
          <div
            class="prize-item"
            v-for="(item, index) in resultList"
            :key="index"
          >
            <div class="col">
              <div class="sub-title">Address:</div>
              <div class="value">
                {{ item.address.substring(0, 6) }}...{{
                  item.address.substring(item.address.length - 4)
                }}
              </div>
            </div>
            <div class="col pointer" @click="openSolScan(item)">
              <div class="sub-title">Hash:</div>
              <div class="value">
                {{ item.signature.substring(0, 6) }}...{{
                  item.signature.substring(item.signature.length - 4)
                }}
                <img class="icon" src="../assets/images/more-icon.png" alt="" />
              </div>
            </div>
            <div class="col">
              <div class="sub-title">Prize won:</div>
              <div class="value">
                {{ item.prize }}
              </div>
            </div>
            <div class="col">
              <div class="sub-title">Createtime:</div>
              <div class="value">
                {{ item.bettingTime }}
              </div>
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
import dayjs from "dayjs";

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.resultList = [];
        this.getPrizeDetail();
      }
    },
  },
  data() {
    return {
      historyList: [],
      currentPage: 1,
      isMore: false,
      isLoading: false,
      data: {},
      currentPage: 1,
      resultList: [],
    };
  },
  methods: {
    openSolScan(item) {
      window.open("https://solscan.io/tx/" + item.signature);
    },
    async getPrizeDetail() {
      try {
        this.isLoading = true;
        const data = await api.getPrizeDetail({
          pageNum: this.currentPage,
          pageSize: 4,
          phase: this.$route.query.phase,
        });
        this.isLoading = false;

        if (data.code === 200) {
          this.isMore = data.data.length === 4;
          console.log(this.isMore)
          this.resultList = this.resultList.concat(
            data.data.map((item) => {
              item.bettingTime = dayjs(+(item.betting + "000")).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              return item;
            })
          );
        }
      } catch (e) {
        console.log(e);
        this.isLoading = false;
      }
    },
    more() {
      this.currentPage += 1;
      this.getPrizeDetail();
      // this.historyList = this.historyList.concat(this.historyList);
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
      padding: 20px 30px 30px;
      max-height: 660px;
      overflow-y: auto;

      .prize-list {
        .prize-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 60px;
          border-bottom: 1px solid #2a3b67;

          .col {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex: 1;

            &.pointer {
              cursor: pointer;
            }

            .sub-title {
              color: #8499cd;
              font-size: 14px;
            }

            .value {
              color: #fff;
              font-size: 14px;
              margin-left: 4px;

              display: flex;
              justify-content: flex-start;
              align-items: center;

              img {
                width: 16px;
                margin-left: 4px;
              }
            }
          }
        }
      }

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
        margin: 50px auto 0;
        cursor: pointer;
      }

      .result-box {
        margin-bottom: 40px;
        padding: 0 70px;
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