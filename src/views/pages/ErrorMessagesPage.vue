<template>
  <div class="d-flex flex-column justify-center align-center fill-height">
    <div
      v-if="currentErrorMessage && currentErrorMessage.messageTitle"
      class="text-h3 text-center mb-5 font-weight-bold"
    >
      {{ currentErrorMessage.messageTitle }}
    </div>
    <div
      v-if="currentErrorMessage && currentErrorMessage.messageSubTitle"
      class="text-h5 mb-14 font-weight-medium"
    >
      {{ currentErrorMessage.messageSubTitle }}
    </div>
    <div v-if="currentErrorMessage && currentErrorMessage.redirect">
      <v-btn variant="flat" color="primary" @click="onGoBackClick">Go Back</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorMessagesPage",
  components: {},
  props: {
    messageId: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    currentErrorMessage: null
  }),
  created() {},
  mounted() {
    const isMessageExist = this.errorMessages.find((message) => {
      return message.id == this.messageId;
    });

    if (isMessageExist) {
      this.currentErrorMessage = isMessageExist;
    } else {
      // default message
      this.currentErrorMessage = this.errorMessages[0];
    }
  },
  methods: {
    onGoBackClick() {
      this.$router.push({
        name: "HomePage"
      });
    }
  },
  computed: {
    errorMessages() {
      return [
        {
          id: 0,
          messageTitle: "Page Not Found",
          messageSubTitle: "We tried but the page you are looking for is not exist!",
          messageImg: null,
          redirect: true
        },
        {
          id: 1,
          messageTitle: "Sorry! this screen is not supported",
          messageSubTitle: "Please try again in desktop devices",
          messageImg: null,
          redirect: false
        }
      ];
    }
  },
  watch: {}
};
</script>

<style scoped></style>
