<template>
  <div class="main">
    <div class="content">
      <div class="title">Results record</div>
      <div class="history-list">
        <div
          class="history-item"
          v-for="(item, index) in historyList"
          :key="index"
        >
          <div class="sub-title">
            {{ item.title }}
            <p class="text" @click="openDetail(item)">
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
      </div>

      <div class="more" v-show="isMore" @click="more">More</div>
    </div>
  </div>
</template>
<script>
import api from "@/utils/api";
export default {
  data() {
    return {
      historyList: [],
      currentPage: 1,
      isMore: false,
    };
  },
  created() {
    this.getHistoryList();
  },
  methods: {
    more() {
      this.currentPage += 1;
      this.getHistoryList();
    },
    openDetail(item) {
      localStorage.setItem("CURRENT_PRIZE", JSON.stringify(item));
      this.$router.push(`/prize-detail?phase=${item.phase}`);
    },
    async getHistoryList() {
      const data = await api.getPrizeList({
        pageNum: this.currentPage,
        pageSize: 10,
      });

      if (data.code === 200) {
        this.isMore = data.data.length === 10;
        this.historyList = this.historyList.concat(
          data.data.map((item) => {
            const no = item.phase || "";
            item.title = `No.${(item.phase || "").replace(
              " ",
              ""
            )} ${no.substring(7)}/${no.substring(4, 6)}/${no.substring(0, 4)}`;
            item.result = [
              item.prizeOne,
              item.prizeTwo,
              item.prizeThree,
              item.prizeFour,
            ];
            return item;
          })
        );
      }
      console.log(data);
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  padding: 0.4rem 0.2rem;
  box-sizing: border-box;
  .title {
    font-size: 0.32rem;
    color: #fff;
    text-align: left;
  }

  .more {
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

  .history-list {
    .sub-title {
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

    .history-item {
      margin-top: 0.2rem;
      width: 100%;
      background: #101729;
      border-radius: 0.2rem;
      padding: 0.2rem;
      box-sizing: border-box;
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