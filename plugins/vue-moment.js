import Vue from 'vue'
const moment = require('moment')
require('moment/locale/ru')

Vue.use(require('vue-moment'), {
	moment
})

Vue.filter('formatDate', function(value) {
	if (value) {
		return moment(String(value)).format('MMMM, YYYY')
	}
});