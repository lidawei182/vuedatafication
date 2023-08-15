<template>
  <div class="dashboard-container">
    <component :is="currentRole"/>
  </div>
</template>

<script>
import adminDashboard from './admin'

export default {
  name: 'DashboardAdmin',
  components: { adminDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {

  },
  created() {

  }
}
</script>
