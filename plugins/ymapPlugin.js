import Vue from 'vue'
import YmapPlugin from 'vue-yandex-maps'

const settings = {
	apiKey: process.env.YANDEX_API_KEY,
	lang: 'ru_RU',
	coordorder: 'latlong',
	enterprise: false,
	version: '2.1'
}

Vue.use(YmapPlugin, settings);
