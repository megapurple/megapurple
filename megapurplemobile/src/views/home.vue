<template>
  <section class="main">
    <div class="content">
      <van-swipe class="banner-list" :autoplay="3000" indicator-color="white">
        <van-swipe-item>
          <img src="../assets/images/mobile-banner.png" alt="" class="banner" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="../assets/images/mobile-banner.png" alt="" class="banner" />
        </van-swipe-item>
      </van-swipe>

      <div class="prize-pool">
        <div class="title">
          Total jackpot
          <p class="text">{{ total }} SOL</p>
        </div>

        <div class="result-list">
          <input
            class="input-item"
            v-model="input1"
            @input="isNumber(1)"
            @blur="numberBlur(1)"
          />
          <input
            class="input-item"
            v-model="input2"
            @input="isNumber(2)"
            @blur="numberBlur(2)"
          />
          <input
            class="input-item"
            v-model="input3"
            @input="isNumber(3)"
            @blur="numberBlur(3)"
          />
          <input
            class="input-item"
            v-model="input4"
            @input="isNumber(4)"
            @blur="numberBlur(4)"
          />
          <!-- <div class="result-item">{{ input1 }}</div>
          <div class="result-item">{{ input2 }}</div>
          <div class="result-item">{{ input3 }}</div>
          <div class="result-item">{{ input4 }}</div> -->
        </div>

        <div class="tools">
          <div class="button" @click="randomNumber">Random</div>
          <div class="button confirm" @click="sendTransaction">Confirm</div>
        </div>
      </div>

      <div class="desc card-box">
        <div class="title">
          <div class="left">
            <p class="text">Mega Purple Gameplay</p>
          </div>
          <div class="right" @click="toDesc">
            Detailed
            <img src="../assets/images/more-icon.png" alt="" class="icon" />
          </div>
        </div>
        <div class="info">
          Mega Purple betting is divided into a red ball number area and a
          purple ball number area, each containing numbers from 1 to 26. In the
          hash result, numbers 1-9 directly correspond to the winning numbers,
          and letters a-z correspond to numbers 1-26 (case insensitive). Due to
          the uncertainty of hashing, the winning numbers may repeat, and the
          probability of winning with numbers 1-9 is higher. For each bet,
          choose 3 red ball numbers and 1 purple ball number, with a single bet
          amount of 0.01 SOL.<br /><br />
          Purchasers can choose machine-selected numbers or self-selected
          numbers. Machine-selected numbers are randomly generated by the
          betting machine, while self-selected numbers are input into the sales
          terminal by the purchaser.<br />
        </div>
      </div>

      <div class="last card-box">
        <div class="title">
          <div class="left">
            <p class="text">Last draw numbers</p>
            <!-- <div class="time" v-if="drawInfo.prizeTime">
              Draw date: {{ drawInfo.prizeTime.substring(6) }}/{{
                drawInfo.prizeTime.substring(4, 6)
              }}/{{ drawInfo.prizeTime.substring(0, 4) }}
            </div> -->
          </div>
          <div class="right" @click="openHistory">
            All records
            <img src="../assets/images/more-icon.png" alt="" class="icon" />
          </div>
        </div>
        <div class="result-list">
          <div
            class="result-item"
            v-for="(item, index) in lastResultList"
            :key="index"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <div class="history last card-box" v-show="historyList.length !== 0">
        <div class="title">
          <div class="left">
            <p class="text">Betting history</p>
          </div>
        </div>

        <div class="history-list">
          <div
            class="history-item"
            v-for="(item, index) in historyList"
            :key="index"
          >
            <div class="history-title">{{ item.title }}</div>
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

        <div class="more-button" @click="more" v-show="isMore">More</div>
      </div>
    </div>

    <prize-history v-model="showHistory" @detail="openDetail" />

    <prize-detail v-model="showDetail" :detail="detail"></prize-detail>

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

    <div class="prize-mask" v-show="showResult">
      <div class="prize-box">
        <div class="title">
          Application submitted
          <img
            @click="showResult = false"
            src="../assets/images/close-icon.png"
            class="close"
            alt=""
          />
        </div>
        <div class="prize-main">
          <div class="result-box">
            <div class="result-title">Bet number is:</div>
            <div class="result-list">
              <div class="result-item">
                {{ input1 }}
              </div>
              <div class="result-item">
                {{ input2 }}
              </div>
              <div class="result-item">
                {{ input3 }}
              </div>
              <div class="result-item">
                {{ input4 }}
              </div>
            </div>
          </div>

          <div class="button" @click="showResult = false">Sure</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import api from "@/utils/api";
import PrizeHistory from "../components/PrizeHistory.vue";
import PrizeDetail from "../components/PrizeDetail.vue";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from "@solana/web3.js";
export default {
  components: { PrizeHistory, PrizeDetail },
  data() {
    return {
      showResult: false,
      detail: {},
      showDetail: false,
      isLoading: false,
      input1: "",
      input2: "",
      input3: "",
      input4: "",
      lastResultList: ["06", "13", "25", "03"],
      showHistory: false,
      historyList: [],
      drawInfo: {
        prizeTime: "",
      },
      isMore: false,
      currentPage: 1,
      total: "",
    };
  },
  async created() {
    this.randomNumber();
    if (typeof window.okxwallet !== "undefined") {
      console.log("OKX is installed!");
    }

    this.getPrizeList();
    this.getUserHistoryList();
    this.getTotalPrize();

    window.setInterval(() => {
      this.currentPage = 1;
      this.historyList = [];
      this.getUserHistoryList();
    }, 30000);

    window.setInterval(() => {
      this.getTotalPrize();
    }, 30000);

    this.$EventBus.$on("refreshHistory", (data) => {
      this.currentPage = 1;
      this.historyList = [];
      this.getUserHistoryList();
    });

    this.$EventBus.$on("logout", (res) => {
      this.historyList = [];
    });

    // const connection = new Connection(
    //   "https://go.getblock.io/8e0013c60bd14029b398786f9cc0cb74",
    //   "confirmed"
    // );

    // const result = await connection.getRecentBlockhash();

    // console.log(result);
  },
  methods: {
    async getTotalPrize() {
      const data = await api.getTotalPrize({});
      if (data.code === 200) {
        this.total = data.data.balanceInSol;
      }
    },
    openDetail(payload) {
      this.showDetail = true;
      this.detail = payload;
    },
    more() {
      this.currentPage += 1;
      this.getUserHistoryList();
    },
    async getUserHistoryList() {
      if (localStorage.getItem("TOKEN")) {
        // this.isLoading = true;
        const data = await api.getUserHistoryList({
          pageNum: this.currentPage,
          pageSize: 4,
        });
        // this.isLoading = false;
        if (data.code === 200) {
          this.isMore = data.data.length === 4;
          this.historyList = this.historyList.concat(
            data.data.map((item) => {
              const no = item.phase || "";
              item.title = `No.${(item.phase || "").replace(
                " ",
                ""
              )} ${no.substring(6)}/${no.substring(4, 6)}/${no.substring(
                0,
                4
              )}`;
              item.result = item.memo.split(" ");
              return item;
            })
          );
        }
      }
    },
    async getPrizeList() {
      this.isLoading = true;

      const data = await api.getPrizeList({ pageNum: 1, pageSize: 10 });
      this.isLoading = false;
      if (data.code === 200) {
        const [first] = data.data;
        if (first) {
          this.lastResultList = [
            first.prizeOne,
            first.prizeTwo,
            first.prizeThree,
            first.prizeFour,
          ];
          first.prizeTime = first.phase || "";
          this.drawInfo = first;
        }
      }
    },
    numberBlur(index) {
      const key = "input" + index;
      if (this[key] > 26 || this[key] < 1) {
        this.$toast("The number must be between 1 and 26!");
        this[key] = "";
      } else if (this[key] < 10) {
        this[key] = this[key].replace("0", "");
        this[key] = `0${this[key]}`;
      }
      // const indexList = [1, 2, 3];
      // indexList.splice(
      //   indexList.findIndex((it) => it === index),
      //   1
      // );

      // if (index < 4) {
      //   for (let i = 0, l = indexList.length; i < l; i++) {
      //     if (this[key] === this["input" + indexList[i]]) {
      //       this[key] = "";
      //       this.$toast("数字不能重复");
      //       break;
      //     }
      //   }
      // }

      // const arr = [this.input1, this.input2, this.input3, this.input4];
      // arr.sort((a, b) => a - b);

      // this.input1 = arr[0];
      // this.input2 = arr[1];
      // this.input3 = arr[2];
      // this.input4 = arr[3];
    },
    isNumber(index) {
      const key = "input" + index;
      this[key] = this[key].substring(0, 2).replace(/\D/gi, "");
    },
    async sendTransaction() {
      const token = localStorage.getItem("TOKEN");
      if (!token) {
        this.$EventBus.$emit("openWalletLink");
      } else {
        if (
          !this.input1.trim() ||
          !this.input2.trim() ||
          !this.input3.trim() ||
          !this.input4.trim()
        ) {
          this.$toast("Please enter your number!");
        } else {
          this.isLoading = true;
          const currentWallet = localStorage.getItem("CURRENT_WALLET");
          const memo = `${this.input1} ${this.input2} ${this.input3} ${this.input4}`;
          try {
            if (currentWallet === "OKX") {
              const connection = new Connection(
                "https://solana-mainnet.g.alchemy.com/v2/0tzgd0INUDEFUqTmgiyP5m0pVT43t9LA",
                "confirmed"
              );

              const payer = new PublicKey(localStorage.getItem("ADDRESS"));
              const MEMO_PROGRAM_ID = new PublicKey(
                "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
              );
              const transaction = new Transaction().add(
                SystemProgram.transfer({
                  fromPubkey: payer,
                  toPubkey: "CgDFU9TMXZ1MdEJmd2mghYC3JS54DNYEkaCtQw4jCfPD",
                  lamports: 0.01 * LAMPORTS_PER_SOL,
                })
              );
              // 将 memo 编码为 Uint8Array
              const memoInstruction = new TransactionInstruction({
                programId: MEMO_PROGRAM_ID,
                keys: [],
                data: Buffer.from(memo, "utf-8"),
              });

              // 将 memo 指令添加到交易
              transaction.add(memoInstruction);
              const { blockhash } = await connection.getRecentBlockhash();
              transaction.recentBlockhash = blockhash; // 设置最近区块哈希
              transaction.feePayer = payer; // 设置费用支付者

              const { signature } =
                await window.okxwallet.solana.signAndSendTransaction(
                  transaction
                );
              console.log("Transaction Signature", signature);
              this.isLoading = false;
              this.showResult = true;

              await connection.confirmTransaction(signature);
              this.$toast("Transaction confirmed");
              console.log("Transaction confirmed");
            } else if (currentWallet === "Phantom") {
              const connection = new Connection(
                "https://solana-mainnet.g.alchemy.com/v2/0tzgd0INUDEFUqTmgiyP5m0pVT43t9LA",
                "confirmed"
              );
              const payer = new PublicKey(localStorage.getItem("ADDRESS"));
              const MEMO_PROGRAM_ID = new PublicKey(
                "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
              );
              const transaction = new Transaction().add(
                SystemProgram.transfer({
                  fromPubkey: payer,
                  toPubkey: "CgDFU9TMXZ1MdEJmd2mghYC3JS54DNYEkaCtQw4jCfPD",
                  lamports: 0.01 * LAMPORTS_PER_SOL,
                })
              );
              // 将 memo 编码为 Uint8Array
              const memoInstruction = new TransactionInstruction({
                programId: MEMO_PROGRAM_ID,
                keys: [],
                data: Buffer.from(memo, "utf-8"),
              });

              // 将 memo 指令添加到交易
              transaction.add(memoInstruction);
              const { blockhash } = await connection.getRecentBlockhash();
              transaction.recentBlockhash = blockhash; // 设置最近区块哈希
              transaction.feePayer = payer; // 设置费用支付者

              const { signature } =
                await window.phantom.solana.signAndSendTransaction(transaction);
              console.log("Transaction Signature", signature);
              this.isLoading = false;
              this.showResult = true;

              await connection.confirmTransaction(signature);
              console.log("Transaction confirmed");
              this.$toast("Transaction confirmed");
            } else if (currentWallet === "Magic Eden") {
              try {
                const provider = window.magicEden.solana;
                this.isLoading = true;
                this.loadingText = "Link...";
                // const connection = new Connection(window.solana, 'processed');
                const resp = await provider.connect();
                this.isLoading = false;

                const address = resp.publicKey.toString();
                localStorage.setItem("ADDRESS", address);
              } catch (e) {
                this.isLoading = false;
                this.$toast.fail({
                  message:
                    "Connection failed, please retry or check if Magic Eden Wallet is installed!",
                });
              }
              this.isLoading = true;
              const connection = new Connection(
                "https://solana-mainnet.g.alchemy.com/v2/0tzgd0INUDEFUqTmgiyP5m0pVT43t9LA",
                "confirmed"
              );
              const payer = new PublicKey(localStorage.getItem("ADDRESS"));
              const MEMO_PROGRAM_ID = new PublicKey(
                "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
              );
              const transaction = new Transaction().add(
                SystemProgram.transfer({
                  fromPubkey: payer,
                  toPubkey: "CgDFU9TMXZ1MdEJmd2mghYC3JS54DNYEkaCtQw4jCfPD",
                  lamports: 0.01 * LAMPORTS_PER_SOL,
                })
              );
              // 将 memo 编码为 Uint8Array
              const memoInstruction = new TransactionInstruction({
                programId: MEMO_PROGRAM_ID,
                keys: [],
                data: Buffer.from(memo, "utf-8"),
              });

              // 将 memo 指令添加到交易
              transaction.add(memoInstruction);
              const { blockhash } = await connection.getRecentBlockhash();
              transaction.recentBlockhash = blockhash; // 设置最近区块哈希
              transaction.feePayer = payer; // 设置费用支付者

              const { signature } =
                await window.magicEden.solana.signAndSendTransaction(
                  transaction
                );
              console.log("Transaction Signature", signature);
              this.isLoading = false;
              this.showResult = true;

              await connection.confirmTransaction(signature);
              console.log("Transaction confirmed");
              this.$toast("Transaction confirmed");
            }
          } catch (e) {
            this.isLoading = false;
          }
        }
      }
    },
    openHistory() {
      this.$router.push("/history");
      // this.showHistory = true;
    },
    toDesc() {
      this.$router.push("/desc");
    },
    randomNumber() {
      const arr = [];
      for (; arr.length < 3; ) {
        let random = Math.floor(Math.random() * 26 + 1);
        if (arr.some((item) => item === random)) {
          random = Math.floor(Math.random() * 26 + 1);
        } else {
          arr.push(random);
        }
      }
      arr.sort((a, b) => {
        return a - b;
      });
      const last = Math.floor(Math.random() * 26 + 1);
      this.input1 = arr[0] < 10 ? `0${arr[0]}` : `${arr[0]}`;
      this.input2 = arr[1] < 10 ? `0${arr[1]}` : `${arr[1]}`;
      this.input3 = arr[2] < 10 ? `0${arr[2]}` : `${arr[2]}`;
      this.input4 = last < 10 ? `0${last}` : `${last}`;
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  padding: 0.2rem 0 1rem;
  .banner-list {
    width: 100%;
    .banner {
      width: 100%;
      display: block;
    }
  }

  .card-box {
    margin: 0.2rem 0.1rem 0;
    padding: 0.24rem 0.3rem;
    background: #101729;
    border-radius: 0.3rem;

    .more-button {
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

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.1rem;

      .left {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .text {
          color: #fff;
          font-size: 0.28rem;
          font-weight: 500;
          margin-right: 0.3rem;
        }

        .time {
          background: #081024;
          border-radius: 10px;
          padding: 0 10px;
          height: 36px;
          line-height: 36px;
          display: flex;
          color: #8499cd;
          font-size: 14px;
        }
      }

      .right {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #8499cd;
        font-size: 14px;
        cursor: pointer;
        .icon {
          width: 16px;
          margin-left: 4px;
        }
      }
    }

    .result-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0;

      .result-item {
        width: 1.08rem;
        height: 1.08rem;
        background: #17213d;
        box-shadow: inset -1px -4px 11px 0px #182e66;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #e14545;
        font-size: 0.4rem;
        font-family: "number";
        border-radius: 50%;

        &:last-child {
          color: #9b4ad1;
        }
      }
    }

    .info {
      text-align: left;
      color: #8499cd;
      font-size: 14px;
      line-height: 20px;
      padding-bottom: 10px;
    }
  }

  .prize-pool {
    padding: 0.2rem 0.24rem;
    background: linear-gradient(0deg, #0f2238 0%, #101729 100%);
    border-radius: 0.3rem;
    margin: 0.2rem 0.1rem 0;

    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #8499cd;
      font-size: 0.28rem;
      margin-bottom: 0.44rem;

      .text {
        font-size: 0.36rem;
        color: #5ffe99;
        font-family: "number";
        margin-left: 10px;
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

    .tools {
      padding: 40px 0 24px;
      display: flex;
      justify-content: center;
      align-items: center;

      .button {
        cursor: pointer;
        width: 2.6rem;
        height: 0.8rem;
        background: #101729;
        border-radius: 0.4rem;
        border: 0.02rem solid #5ffe99;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #5ffe99;
        font-size: 0.36rem;
        font-weight: 500;

        &.confirm {
          background: linear-gradient(143deg, #5ffe99 0%, #5ffef9 100%);
          color: #01080e;
          margin-left: 0.8rem;
        }
      }
    }
  }

  .history-list {
    padding-top: 20px;

    .history-item {
      color: #8499cd;
      font-size: 18px;
      margin-bottom: 60px;

      &:last-child {
        margin-bottom: 20px;
      }

      .history-title {
        margin-bottom: 10px;
      }
    }
  }
}

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
    width: 7rem;
    background-color: #101729;
    border-radius: 0.4rem;
    overflow: hidden;

    .title {
      height: 1.2rem;
      line-height: 1.2rem;
      padding: 0 0.3rem;
      background-color: #1a2540;
      text-align: left;
      color: #fff;
      font-size: 0.4rem;
      position: relative;

      .close {
        width: 0.4rem;
        position: absolute;
        right: 0.4rem;
        top: 0.4rem;
        cursor: pointer;
      }
    }

    .prize-main {
      padding: 0.2rem 0.4rem 0.3rem;
      // max-height: 660px;
      overflow-y: auto;

      .result-box {
        margin-bottom: 0.4rem;
      }

      .button {
        width: 1.76rem;
        height: 0.72rem;
        background: #081024;
        border-radius: 0.2rem;
        border: 0.01rem solid #1e2c4f;
        font-size: 0.3rem;
        color: #5ffe99;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        cursor: pointer;
      }

      .result-title {
        font-size: 0.36rem;
        color: #8499cd;
        margin-bottom: 0.2rem;
        position: relative;
        line-height: 0.48rem;

        .more {
          position: absolute;
          right: 0;
          top: 0;
          height: 0.48rem;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          cursor: pointer;

          img {
            margin-left: 0.08rem;
            width: 0.16rem;
          }
        }
      }

      .result-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.2rem;

        .result-item {
          width: 1.2rem;
          height: 1.2rem;
          background: #17213d;
          box-shadow: inset -1px -4px 11px 0px #182e66;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #e14545;
          font-size: 0.6rem;
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