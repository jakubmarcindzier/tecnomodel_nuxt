<template>
  <div>
    <client-only>
      <span
        v-if="descriptionLabel"
        :class="{
          'text-danger': !campaignName,
          'text-dark': campaignName,
        }"
        >Scade tra
      </span>
      <span
        :class="{
          h1: size === 'h1',
          h2: size === 'h2',
          h3: size === 'h3',
          h4: size === 'h4',
          h5: size === 'h5',
          h6: size === 'h6',
        }"
      >
        <b-badge
          :variant="campaignName === 'BLACK FRIDAY' ? 'dark' : 'danger'"
          class="font-italic"
        >
          <vue-countdown-timer
            v-if="thruDate"
            :end-time="thruDate"
            :end-text="'Scaduto!'"
            :hour-txt="'h'"
            :minutes-txt="'m'"
            :interval="1000"
            label-position="begin"
            :show-zero="false"
            :day-txt="'g'"
            :seconds-txt="'s'"
            :start-time="getCurrentDatetime"
            @end_callback="endCallBack()"
          >
            <template slot="start-label" slot-scope="scope">
              <span v-if="!scope.props.tips"
                ><font-awesome-icon icon="stopwatch"
              /></span>
            </template>
            <template slot="countdown" slot-scope="scope">
              <span v-if="scope.props.days > 0"
                >{{ scope.props.days }} {{ scope.props.dayTxt }}
              </span>
              <span v-if="scope.props.hours > 0"
                >{{ scope.props.hours }}
                {{ scope.props.hourTxt }}
              </span>
              <span v-if="scope.props.minutes > 0"
                >{{ scope.props.minutes }}
                {{ scope.props.minutesTxt }}
              </span>
              <span
                >{{ scope.props.seconds }}
                {{ scope.props.secondsTxt }}
              </span>
            </template>
          </vue-countdown-timer>
        </b-badge>
      </span>
    </client-only>
  </div>
</template>

<script>
export default {
  name: 'CountdownTimer',
  props: {
    thruDate: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: null,
    },
    descriptionLabel: Boolean,
    campaignName: {
      type: String,
      default: null,
    },
  },
  computed: {
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
  methods: {
    endCallBack() {
      this.$emit('endCallBack')
    },
  },
}
</script>
