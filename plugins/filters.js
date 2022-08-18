import Vue from 'vue'

Vue.filter('date', function (value, fullDate = false) {
  value = String(value)
  const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'cентября', 'октября', 'ноября', 'декабря']
  const date = value.slice(8, 10).trim()
  let month = value.slice(4, 7).replace('-0', '').replace('-', '').trim()
  const year = value.slice(11, 15)
  if (!fullDate) return `${date} ${monthNames[+month]}`
  else return `${date} ${month} ${year}`
})
