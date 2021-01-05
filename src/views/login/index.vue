<template>
  <div id="userLayout" class="user-layout-wrapper">
    <div class="container">
      <el-card class="animated flipInY">
        <div class="top">
          <div class="desc">
            <img class="logo_login" src="@/assets/logo_login.png" alt="">
          </div>
          <div class="header">
            <a href="/">
              <span class="title">{{ title }}</span>
            </a>
          </div>
        </div>
        <div class="main">
          <el-form
            ref="loginForm"
            :model="form"
            :rules="rules"
            @keyup.enter.native="submitForm"
          >
            <el-form-item prop="username">
              <el-input ref="username" v-model="form.username" placeholder="请输入用户名">
                <i slot="suffix" class="el-input__icon el-icon-user" /></el-input>
            </el-form-item>
            <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
              <el-form-item prop="password">
                <el-input
                  ref="password"
                  v-model="form.password"
                  :type="lock === 'lock' ? 'password' : 'text'"
                  placeholder="请输入密码"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="login"
                >
                  <i slot="suffix" :class="'el-input__icon el-icon-' + lock" @click="showPwd" />
                </el-input>
              </el-form-item>
            </el-tooltip>
            <el-form-item style="position: relative">
              <el-input
                v-model="form.captcha"
                name="logVerify"
                placeholder="请输入验证码"
                style="width: 60%"
              />
              <div class="vPic">
                <span width="100%" height="100%" @click="chgUrl" v-html="captcha" />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="width: 100%"
                @click.native.prevent="login"
              >登 录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <div class="footer">
        <div class="links">
          <a
            href="https://juejin.cn/user/606586149536430"
          ><img
            src="@/assets/juejin.svg"
            class="link-icon"
          ></a>
          <a
            href="https://www.yuque.com/flipped-aurora/"
          ><img
            src="@/assets/yuque.png"
            class="link-icon"
          ></a>
          <a
            href="https://github.com/yemingrujing/blog-admin"
          ><img
            src="@/assets/github.png"
            class="link-icon"
          ></a>
          <a
            href="https://space.bilibili.com/348385668"
          ><img
            src="@/assets/video.png"
            class="link-icon"
          ></a>
        </div>
        <div class="copyright">Copyright &copy; {{ curYear }} 💖flipped-aurora</div>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate';
import { getCaptcha } from '@/api/user';
import defaultSetting from '@/settings';

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('用户名格式错误'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码格式错误'));
      } else {
        callback();
      }
    };
    const validateCaptcha = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('请输入4位验证码'));
      } else {
        callback();
      }
    };

    return {
      curYear: 0,
      captcha: '',
      lock: "lock",
      form: {
        username: '',
        password: '',
        captcha: ''
      },
      rules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{ required: true, trigger: 'blur', validator: validateCaptcha }]
      },
      capsTooltip: false,
      loading: false,
      title: defaultSetting.title
    };
  },
  created() {
    this.$store.dispatch('user/clearUser');
    this.chgUrl();
    this.curYear = new Date().getFullYear();
  },
  mounted() {
    if (this.form.username === '') {
      this.$refs.username.focus();
    } else if (this.form.password === '') {
      this.$refs.password.focus();
    }
  },
  methods: {
    chgUrl() {
      getCaptcha().then(res => {
        this.captcha = res;
      });
    },
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z');
    },
    showPwd() {
      this.lock === "lock" ? (this.lock = "unlock") : (this.lock = "lock");
    },
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch('user/login', this.form)
              .then(() => {
                this.$router.push('/');
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-register-box {
  height: 100vh;

  .login-box {
    width: 40vw;
    position: absolute;
    left: 50%;
    margin-left: -22vw;
    top: 5vh;

    .logo {
      height: 35vh;
      width: 35vh;
    }
  }
}

.link-icon {
  width: 20px;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
}

.vPic {
  width: 33%;
  height: 38px;
  float: right !important;
  background: #ccc;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.logo_login {
  width: 100px;
}

#userLayout.user-layout-wrapper {
  height: 100%;
  position: relative;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .container {
    position: relative;
    overflow: hidden;
    width: 100%;
    min-height: 100%;
    background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
    background-size: 100%;
    padding: 110px 0 144px;

    a {
      text-decoration: none;
    }

    .el-card {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -270px 0 0 -250px;
      width: 500px;
      height: 420px;
      background: #fff;

      .top {
        text-align: center;
        margin-top: -10px;

        .header {
          height: 28px;
          line-height: 32px;
          margin-bottom: 30px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 28px;
            color: rgba(0, 0, 0, 0.85);
            font-family: Avenir, "Helvetica Neue", Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }

        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
        }
      }
    }

    .main {
      min-width: 260px;
      width: 368px;
      margin: 0 auto;
    }

    .footer {
      position: relative;
      width: 100%;
      padding: 0 20px;
      margin: 540px 0 10px;
      text-align: center;

      .links {
        margin-bottom: 8px;
        font-size: 14px;
        width: 330px;
        display: inline-flex;
        flex-direction: row;
        justify-content: space-between;
        padding-right: 40px;

        a {
          color: rgba(0, 0, 0, 0.45);
          transition: all 0.3s;
        }
      }

      .copyright {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        padding-right: 40px;
      }
    }
  }
}
</style>
