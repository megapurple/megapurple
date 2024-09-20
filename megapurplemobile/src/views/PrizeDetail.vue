<template>
  <div class="content">
    <div class="prize-box">
      <div class="title">Public announcement</div>
      <div class="prize-main">
        <div class="history-item">
          <div class="result-box">
            <div class="result-title">
              {{ detail.title }}
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
        </div>

        <div class="prize-list">
          <div
            class="prize-item history-item"
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
  data() {
    return {
      historyList: [],
      currentPage: 1,
      isMore: false,
      isLoading: false,
      data: {},
      currentPage: 1,
      resultList: [],
      detail: {},
    };
  },
  created() {
    const item = JSON.parse(localStorage.getItem("CURRENT_PRIZE"));
    this.detail = item;
    this.getPrizeDetail();
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
.content {
  padding: 0.4rem 0.2rem;
  box-sizing: border-box;
  height: calc(100vh - 1.2rem);
  overflow-y: auto;
  .title {
    font-size: 0.32rem;
    color: #fff;
    text-align: left;
  }

  .button {
    width: 1.76rem;
    height: 0.72rem;
    background: #081024;
    border-radius: 0.2rem;
    border: 0.02rem solid #1e2c4f;
    font-size: 0.28rem;
    color: #5ffe99;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.4rem auto 0;
    cursor: pointer;
  }

  .history-item {
    margin-top: 0.2rem;
    width: 100%;
    background: #101729;
    border-radius: 0.2rem;
    padding: 0.2rem;
    box-sizing: border-box;
  }

  .prize-list {
    .prize-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;

      .col {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        line-height: 0.8rem;
      }

      .sub-title {
        color: #8499cd;
        font-size: 0.28rem;
        width: 1.6rem;
        text-align: left;
      }

      .value {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 0.28rem;
        color: #fff;

        .icon {
          width: 0.32rem;
          margin-left: 0.08rem;
        }
      }
    }
  }

  .result-box {
    .result-title {
      color: #8499cd;
      font-size: 0.24rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.2rem;

      .text {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        img {
          margin-left: 0.16rem;
          width: 0.32rem;
        }
      }
    }

    .result-list {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .result-item,
      .input-item {
        width: 1.44rem;
        height: 1.44rem;
        line-height: 1.36rem;
        background: #081024;
        border: 0.04rem solid #233566;
        border-radius: 50%;
        font-size: 0.6rem;
        color: #e14545;
        font-family: "number";
        text-align: center;
        box-sizing: border-box;
        padding: 0;

        &:last-child {
          color: #9b4ad1;
        }

        &:focus {
          box-shadow: 0px 0px 0.3rem 0px rgba(95, 254, 153, 0.5);
          border: 0.02rem solid #5ffe99;
        }
      }
    }
  }
}
</style>