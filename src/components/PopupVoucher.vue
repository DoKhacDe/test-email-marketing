<template>
  <transition>
    <div class="popup-overlay" v-if="showPopup">
      <div class="popup-content">
        <button class="close-btn" @click="closePopup">×</button>
        <h2>GET VOUCHER</h2>
        <p>Subscribe to our valued customer's list and claim your coupon to get a voucher for your first order.</p>
        <input type="email" v-model="email" placeholder="Enter your email" @input="validateEmail" />
        <p v-if="emailError" class="error-message">{{ emailError }}</p>
        <button class="get-btn" @click="submitEmail">Get it now</button>
        <p class="decline-text" @click="closePopup">No, thank you. I prefer to pay the entire price.</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      showPopup: false,
      email: '',
      emailError: '', // Thay bằng chuỗi để hiển thị thông báo lỗi cụ thể
    }
  },
  methods: {
    closePopup() {
      const currentTime = new Date().getTime();
      localStorage.setItem('popupClosedTime', currentTime);
      this.showPopup = false;
    },
    submitEmail() {
      this.validateEmail(); // Kiểm tra email trước khi gửi
      if (!this.emailError) {
        this.sendSubscription();
      }
    },
    validateEmail() {
      if (!this.email) {
        this.emailError = 'Email is required!';
      } else if (!this.isValidEmail(this.email)) {
        this.emailError = 'Please enter a valid email!';
      } else {
        this.emailError = '';
      }
    },
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    async sendSubscription() {
      const domain = window.location.hostname; // Lấy domain từ trình duyệt
      const payload = {
        email: this.email,
        domain: domain,
        type: 'wp' // Mặc định là wp
      };

      try {
        const response = await fetch('https://mailcook.customedge.co/api/subscribers/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          this.closePopup();
        } else {
          const errorData = await response.json();
          this.emailError = errorData.message || 'Failed to subscribe. Please try again.';
        }
      } catch (error) {
        console.error('Error:', error);
        this.emailError = 'An error occurred. Please try again later.';
      }
    },

    shouldShowPopup() {
      const closedTime = localStorage.getItem('popupClosedTime');
      if (!closedTime) return true;

      const currentTime = new Date().getTime();
      const timeDiff = currentTime - parseInt(closedTime);
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;

      return timeDiff > threeDaysInMs;
    }
  },
  created() {
    this.showPopup = this.shouldShowPopup();
  },
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: #000;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: #fff;
  position: relative;
  width: 90%;
  max-width: 400px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  color: #fff;
  cursor: pointer;
}

h2 {
  color: #ff0000;
  margin-bottom: 10px;
}

p {
  margin: 10px 0;
  font-size: 14px;
}

input {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
}

.get-btn {
  background: #ff0000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
}

.get-btn:hover {
  background: #cc0000;
}

.decline-text {
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
}

.decline-text:hover {
  color: #ccc;
}

.error-message {
  color: #ff0000;
  font-size: 12px;
  margin: 5px 0;
  text-align: left;
  padding-left: 10%;
}
</style>