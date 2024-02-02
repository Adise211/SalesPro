<template>
  <div class="d-flex flex-column justify-center align-center fill-height">
    <div v-if="currentErrorMessage && currentErrorMessage.messageTitle" class="text-h3 mb-7">
      {{ currentErrorMessage.messageTitle }}
    </div>
    <div v-if="currentErrorMessage && currentErrorMessage.messageSubTitle" class="text-h5 mb-7">
      {{ currentErrorMessage.messageSubTitle }}
    </div>
    <div>
      <v-btn variant="flat" color="primary" @click="onGoBackClick">Go Back</v-btn>
    </div>
  </div>
</template>

<script>
import { CalendarPageMode } from "@/utilities/consts";
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
    this.currentErrorMessage = this.errorMessages.find((message) => {
      return message.id == this.messageId;
    });
    console.log("currentErrorMessage", this.currentErrorMessage);
  },
  methods: {
    onGoBackClick() {
      this.$router.push({
        name: "CalendarPage",
        params: {
          calendarMode: CalendarPageMode.View
        }
      });
    }
  },
  computed: {
    errorMessages() {
      return [
        {
          id: 0,
          messageTitle: "Page Not Found",
          messageSubTitle: "We tried but the page you are looking for is not exist",
          messageImg: null
        },
        {
          id: 1,
          messageTitle: "Sorry, this screen is not supported",
          messageSubTitle: "Please try again in desktop devices",
          messageImg: null
        }
      ];
    }
  },
  watch: {}
};
</script>

<style scoped></style>
