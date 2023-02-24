<template>
  <div>
    <client-only>
      <div v-if="!thruDate" class="d-inline">{{ deliveryMessage }}</div>
      <vue-countdown-timer
        v-if="thruDate && !expired"
        :start-time="getCurrentDatetime"
        :end-time="thruDate"
        :interval="1000"
        label-position="begin"
        :show-zero="false"
        class="d-inline"
        @end_callback="expired = true"
      >
        <template slot="start-label">
          {{ deliveryMessage }} {{ $t('orderLimit') }}
        </template>
        <template slot="countdown" slot-scope="scope">
          <span v-if="scope.props.days > 0"
            >{{ parseInt(scope.props.days) }}
            {{ $tc('day', scope.props.days) }},
          </span>
          <span v-if="scope.props.hours > 0"
            >{{ parseInt(scope.props.hours) }}
            {{ $tc('hour', scope.props.hours) }}</span
          >
          <span v-if="scope.props.hours > 0 && scope.props.minutes > 0">
            e
          </span>
          <span v-if="scope.props.minutes > 0">
            {{ parseInt(scope.props.minutes) }}
            {{ $tc('minute', scope.props.minutes) }}</span
          >
          <span
            v-if="
              scope.props.hours < 1 &&
              scope.props.minutes > 0 &&
              scope.props.minutes <= countDownSecondsFromLastMinute
            "
          >
            e
          </span>
          <span
            v-if="
              scope.props.hours < 1 &&
              scope.props.minutes <= countDownSecondsFromLastMinute
            "
          >
            {{ parseInt(scope.props.seconds) }}
            {{ $tc('second', scope.props.seconds) }}</span
          >
        </template>
      </vue-countdown-timer>
      <template v-if="deliveryDate">
        <b-link id="popover-target-1" class="ml-1 mr-1"
          ><font-awesome-icon icon="info-circle" class="main-color"
        /></b-link>
        <b-popover
          target="popover-target-1"
          triggers="hover"
          placement="bottom"
        >
          <div class="text-justify">
            La data di consegna è calcolata su una tempistica di transito del
            corriere di 24h in Italia, ma può essere soggetta a variazioni fino
            a 48h in alcuni periodi dell’anno, o per consegna verso Calabria,
            Sicilia e Sardegna.
          </div>
        </b-popover>
      </template>
    </client-only>
  </div>
</template>

<script>
export default {
  name: 'DeliveryMessage',
  props: {
    deliveryDate: {
      type: String,
      default: null,
    },
    thruDate: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      expired: false,
      countDownSecondsFromLastMinute: 5,
    }
  },
  computed: {
    deliveryMessage() {
      if (this.deliveryDate !== null) {
        const date = new Date(this.deliveryDate.replace(' ', 'T'))
        return (
          this.$t('deliveryMessage') +
          ' ' +
          this.$t('weekDayName')[date.getDay()] +
          ' ' +
          date.getDate() +
          ' ' +
          this.$t('monthName')[date.getMonth()]
        )
      }
      return ''
    },
    getCurrentDatetime() {
      const date = new Date()
      return (
        date.getUTCFullYear() +
        '/' +
        ('0' + (date.getUTCMonth() + 1)).slice(-2) +
        '/' +
        ('0' + date.getUTCDate()).slice(-2) +
        ' ' +
        ('0' + date.getUTCHours()).slice(-2) +
        ':' +
        ('0' + date.getUTCMinutes()).slice(-2) +
        ':' +
        ('0' + date.getUTCSeconds()).slice(-2)
      )
    },
  },
}
</script>
