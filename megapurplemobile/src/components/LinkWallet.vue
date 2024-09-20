<template>
  <div class="link-mask" v-show="value" @click="close">
    <div class="link-box">
      <!-- <div class="title">
        Link wallet
        <img
          @click="close"
          src="../assets/images/close-icon.png"
          class="close"
          alt=""
        />
      </div> -->
      <div class="link-main">
        <div class="link-list">
          <div
            class="link-item"
            v-for="(item, index) in walletList"
            :key="index"
            @click.stop="linkWallet(item)"
          >
            <div class="name">{{ item.name }}</div>
            <img :src="item.icon" class="icon" alt="" />
          </div>
        </div>
      </div>
    </div>

    <div class="mask" v-show="showLoading">
      <div class="loading-box">
        <div class="loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div class="text">{{ loadingText }}</div>
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
      showLogin: false,
      showLoading: false,
      loadingText: "Link...",
      walletList: [
        {
          name: "OKX",
          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAmpJREFUaIHtmb2O2kAQx8eWrTVaI7uicUMk2AYQLlxQWGZ5gtM9QfIm8CjJEyR+AnwdHU5LE1JAQXNGgABjtOnQKXx4QT6W0/knTTfMzt+a3dEwEpyAUmomSfI1SRJ7vV7bm83GZIyVT/m+F6qqjhljUbFYHCOEfsVx/DIYDMapP/Q8r1upVF4Nw2AA8BCGMWaEEOZ5Xvds4pTSsuM4Q4yx8ITPmaZpzHGcYavVOq4Gx3GGCCHhSfKKOCqbj5D825JyXbcHACBRSsvT6fTPaDS67bYJolqtRpZlfZH3+z2dTCai87ma2Wxm7na7b3Icx0+r1Up0Plczn88hSZKmvFwu7/q+Z8lms7EVADB5nG3bBtO87BoEAdfBWcXabrcmEEJSbz2llPFg2/ZdYxFCmMz1yThJ+6rvEStTASLIBYgmFyCazyEgiqLMDswyFgCAwuMUhiF0Op2LPlEUQbvdhm73/NAEAOD7PlesMAx5UgOuTsxr/X4/tcP2+/3Mzsu8E4sgFyCaXIBocgGi4WpkwDkG+r6fGsf3/UzH03ykfEs+Ut5ALkA0uQDRfA4BDz1SyrI8BoCL/1DzjpQ8Y2CWsVRVHUOz2RyKXhndarVabSgjhH6nSn1QdF3/K6uqGhqGITqXq8EYA0Lop6yq6vdSqZTtzboDlmVBHMcvAADgum7vkRfc/5umaYc164GPuug+9AFd158bjUaIELprKVwDxhjq9Xqo6/r5d9h13R4hhD1SSRmGwSqVyutR2QCAdEoEpbS83+9pHMdPi8WiLEmSudvt7rqOlSRprGlaVCgUQkVRQkVRfgRBcPTY/ANzIS3SMzJbTAAAAABJRU5ErkJggg==",
        },
        // {
        //   name: "Phantom",
        //   icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA3pJREFUaIHtmVFuGkkQQF81IO1KiY1vMDlB1icInCCxtEbar/WcIOEEmBtkT9DsVxJjacgJwp4g+HO/wg2MwRLSmpnaD8AeBoYM0DhY4X3NdPV0V1XXTHXXwJ49Pzfy2BMGVov/MSgZkVeq6gnqKRRjCvVAeoh0UD6f+s/by8Z7FAMCq8UR/TOQ10BplWcFuhHUK/5BI0W+PZp2UEJ4LapncS+vg0A3R6F84v/aTbS7J7BDb8SdXdXbGegpplzxn3WmDU4NGIfKbQ30nctxE/TyFI6nK2Fcjdq0g1LI4OuWlQcoTlYXXKzAI3l9DgW/4h80NlqBwA69R/L6HAJ/sskKNO2gJGiw6ddlE5TwOLfOg5f29i3oR+AX92plR5B/Vw6hph3UlOj9ZlNrD7Sap/BCwR9n35gU7QqcKOZ4kfyhH6X8qsqDnm+mPChSjWXWxoXtI2Afekj9d/+gNbnpNO2NB1JLjmOQl5lXwJXyAMltQYGwtUyeT1lxhWImA1wqv4gT/+g+RAS6y+QJvm/AJ9t/41r5wF57s/fD+3sFL7DXxVn57W9pYy01ILBDLzcTm24YkX8bvw/lrpaQ12bl0Uz/OKl5ILBaDBl8VfDS+mxIG/QfkFeLNn0KLUGv0uRMwi3VgMtG36py5lprpwjthSF0YftnO688oKpXcwYEdugZmPvm7ibSmTMglLvaFuPeMWFn5h2YnKS+/TiFsqNot+IfvphZgfhBYdcxSJt4Hri0/TdbOMNuDUX+Jm6AQmqy2DUU7U7rRYaHVP5kvA9Sn14ZFqTyXWb88j7sVs2k9Ul6H0CadlAC/fLjFMrO9NMZbzMQPRHvay8kKidbzWS352QCN+OkUv/DP5o77BgQV2WRz+s9ptUMfeqn/uHCY6UBTT3tZEWgIUgrQ9ekYlVB5rya6FM/9Q9TT4Qb10YV7eYIq9HKBa6xV3OEbUXnjBi3SXmZ8gArlVUWTRISlSv+US+wt50RUdYnq9OQOPGPeh/sdTmHeWdEDiPVG8G0Kv7B0j8zU+TC9r/JGtvnqfLxF6tp+1+WZfRxwcr43/tttArGoCu/fIuUBxgR+unhoPUC0bFL5VknkSn6V4HofEmtZlr4LUZQLFBoJ38LuUTGE96cLyrdJXq2Uam79uCm3J/IPthrL485R3ipOv6iiEhXVa8E09o1xffs2TPmf1vhhyGadgBRAAAAAElFTkSuQmCC",
        // },
        {
          name: "Magic Eden",
          icon: "data:image/png;base64,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",
        },
      ],
    };
  },
  methods: {
    async toLogin(address, currentWallet) {
      try {
        const data = await api.toLogin({ address });
        this.showLoading = false;
        if (data.code === 200) {
          localStorage.setItem("TOKEN", data.data.token);
          localStorage.setItem("ADDRESS", address);
          localStorage.setItem("CURRENT_WALLET", currentWallet);

          this.close();
          this.$toast.success({
            message: "Connection success!",
          });
          this.$emit("success");
        }
      } catch (e) {
        this.$toast.fail({
          message: "Connection failed,try again!",
        });
      }
    },
    async linkWallet(item) {
      if (item.name === "OKX") {
        try {
          const provider = window.okxwallet.solana;
          this.showLoading = true;
          this.loadingText = "Link...";
          const resp = await provider.connect();
          const address = resp.publicKey.toString();
          this.showLoading = false;
          this.close();
          this.toLogin(address, "OKX");
        } catch (e) {
          this.showLoading = false;
          this.$toast.fail({
            message:
              "Connection failed, please retry or check if OKX Wallet is installed!",
          });
        }
      } else if (item.name === "Phantom") {
        try {
          const provider = window.phantom.solana;
          this.showLoading = true;
          this.loadingText = "Link...";
          // const connection = new Connection(window.solana, 'processed');
          const resp = await provider.connect();
          this.showLoading = false;

          const address = resp.publicKey.toString();
          this.close();
          this.toLogin(address, "Phantom");
        } catch (e) {
          this.showLoading = false;
          this.$toast.fail({
            message:
              "Connection failed, please retry or check if Phantom Wallet is installed!",
          });
        }
      } else if (item.name === "Magic Eden") {
        try {
          const provider = window.magicEden.solana;
          this.showLoading = true;
          this.loadingText = "Link...";
          // const connection = new Connection(window.solana, 'processed');
          const resp = await provider.connect();
          this.showLoading = false;

          const address = resp.publicKey.toString();
          this.close();
          this.toLogin(address, "Magic Eden");
        } catch (e) {
          this.showLoading = false;
          this.$toast.fail({
            message:
              "Connection failed, please retry or check if Magic Eden Wallet is installed!",
          });
        }
      }
    },
    close() {
      this.$emit("input", false);
    },
  },
};
</script>
    <style lang="less" scoped>
.link-mask {
  position: fixed;
  left: 0;

  top: 1.2rem;
  z-index: 998;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);

  .link-box {
    width: 100%;
    background-color: #101729;
    border-radius: 0px 0px 0.4rem 0.4rem;
    overflow: hidden;

    .link-main {
      padding: 0.3rem 0 0.3rem;

      .link-list {
        .link-item {
          padding: 0.3rem 0.6rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;

          &:hover {
            background-color: #1a2540;
          }

          .name {
            color: #fff;
            font-size: 0.28rem;
          }

          .icon {
            width: 0.6rem;
          }
        }
      }
    }
  }
}

.mask {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);

  .text {
    margin-top: 50px;
    color: #fff;
    font-size: 20px;
  }
}
</style>