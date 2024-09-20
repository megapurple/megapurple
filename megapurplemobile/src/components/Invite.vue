<template>
  <div class="invite-mask" v-show="value">
    <div class="invite-box">
      <div class="title">
        Invite
        <img
          @click="close"
          src="../assets/images/close-icon.png"
          class="close"
          alt=""
        />
      </div>
      <div class="invite-main">
        <div class="input-list">
          <input
            class="input-item"
            v-model="input1"
            :disabled="disabled"
            :readonly="disabled"
            @input="isNumber(1)"
          />
          <input
            class="input-item"
            v-model="input2"
            :disabled="disabled"
            :readonly="disabled"
            @input="isNumber(2)"
            ref="input2"
          />
          <input
            class="input-item"
            v-model="input3"
            :disabled="disabled"
            :readonly="disabled"
            @input="isNumber(3)"
            ref="input3"
          />
          <input
            class="input-item"
            v-model="input4"
            :disabled="disabled"
            :readonly="disabled"
            @input="isNumber(4)"
            ref="input4"
          />
          <input
            class="input-item"
            v-model="input5"
            :disabled="disabled"
            :readonly="disabled"
            @input="isNumber(5)"
            ref="input5"
          />
        </div>
        <div
          class="button"
          @click="confirmInvite"
          :class="{ disabled: disabled }"
        >
          Confirm
        </div>
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
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    userInfo(val) {
      // if(val.)
      if (val.superiorInvitationCode) {
        this.input1 = val.superiorInvitationCode[0];
        this.input2 = val.superiorInvitationCode[1];
        this.input3 = val.superiorInvitationCode[2];
        this.input4 = val.superiorInvitationCode[3];
        this.input5 = val.superiorInvitationCode[4];
        this.disabled = true;
      } else {
        this.disabled = false;
        this.input1 = "";
        this.input2 = "";
        this.input3 = "";
        this.input4 = "";
        this.input5 = "";
      }
    },
  },
  data() {
    return {
      input1: "",
      input2: "",
      input3: "",
      input4: "",
      input5: "",
      input6: "",
      isLoading: false,
      disabled: false,
    };
  },
  methods: {
    async confirmInvite() {
      if (this.disabled) {
        return;
      }
      if (
        this.input1 &&
        this.input2 &&
        this.input3 &&
        this.input4 &&
        this.input5
      ) {
        try {
          this.isLoading = true;
          const data = await api.setInviteCode({
            invitationCode: `${this.input1}${this.input2}${this.input3}${this.input4}${this.input5}${this.input6}`,
          });
          this.isLoading = false;
          if (data.code === 200) {
            this.$toast("Successfully!");
            this.close();
          }
        } catch (e) {
          this.isLoading = false;
        }
      } else {
        this.$toast("Please enter the invitation code!");
      }
    },
    close() {
      this.$emit("input", false);
    },
    isNumber(index) {
      const key = `input${index}`;
      const nextKey = "input" + (index + 1);
      this[key] = this[key].substring(this[key].length - 1);
      if (this.$refs[nextKey]) {
        this.$refs[nextKey].focus();
      }
    },
  },
};
</script>
<style lang="less" scoped>
.invite-mask {
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

  .invite-box {
    width: 7rem;
    background-color: #101729;
    border-radius: 0.6rem;
    overflow: hidden;

    .title {
      height: 1.48rem;
      line-height: 1.48rem;
      padding: 0 0.6rem;
      background-color: #1a2540;
      text-align: left;
      color: #fff;
      font-size: 0.48rem;
      position: relative;

      .close {
        width: 0.4rem;
        position: absolute;
        right: 0.6rem;
        top: 0.6rem;
        cursor: pointer;
      }
    }

    .invite-main {
      padding: 0.8rem 0.22rem 0.4rem;
      .placeholder {
        color: #8499cd;
        font-size: 0.64rem;
        font-weight: 500;
        margin-bottom: 0.4rem;
      }

      .input-list {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .input-item {
          width: 1.2rem;
          height: 1.2rem;
          background: #0e162b;
          border-radius: 0.4rem;
          border: 0.04rem solid #233566;
          text-align: center;
          font-size: 0.4rem;
          color: #fff;
          font-family: "number";
          padding: 0;
          box-sizing: border-box;

          &:focus {
            box-shadow: 0px 0.04rem 0.2rem 0px rgba(95, 254, 153, 0.5);
            border: 0.04rem solid #5ffe99;
          }
        }
      }

      .button {
        height: 1.36rem;
        background: linear-gradient(143deg, #5ffe99 0%, #5ffef9 100%);
        border-radius: 0.68rem;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.6rem auto 0;
        font-size: 0.48rem;
        color: #01080e;
        cursor: pointer;

        &.disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>