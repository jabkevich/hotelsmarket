const getPusherUID = () => {
	return this.$cookies.get('uid') || null
}


export const state = () => ({
	preloader: false,
	currentHotel: null,
	pusherUID: null,
	localUID: null,
	hotelsList: [],
	selectedHotel: null,
	lastSearchData: null,
	localSearchData: null,
	booking: {
		stage: 'personalData',
		productInfo: null,
		form: {
			firstName: null,
			secondName: null,
			middleName: null,
			email: null,
			phone: null,
			getExtraInfo: false,
			getNewsInfo: false,
			forAnotherPerson: false,
			guests: [],
			checkInTime: null,
			checkOutTime: null,
			moreInfo: null
		},
		hotel: {
			id: null,
		},
		room: {
			id: null
		},
		tariff: {
			id: null
		},
		services: [],
		sum: null
	},
	formData: {
		place: null,
		type: null,
		startDate: null,
		endDate: null,
		stars: null,
		accommodation: [
			{ adults: 2 },
		],
	},
	activeRoom: null,
	hotelsSearchInProgress: false,
	reviews: [],
	localSearchResult: null,
	localLoading: false,
	services: []
})
export const mutations = {
	HOTELS_SEARCH_IN_PROGRESS_TOGGLE (state, value) {
		state.hotelsSearchInProgress = value
	},
	PRELOADER_TOGGLE (state, value) {
		state.preloader = value
	},
	BOOKING_HOTEL (state, value) {
		state.booking.hotel.id = value.id
	},
	BOOKING_SERVICES (state, value) {
		state.booking.services = value
	},
	BOOKING_SUM (state, value) {
		state.booking.sum = value
	},
	BOOKING_ROOM (state, value) {
		state.booking.room.id = value.id
	},
	BOOKING_TARIFF (state, value) {
		state.booking.tariff.id = value.id
	},
	BOOKING_STAGE_CHANGE (state, value) {
		state.booking.stage = value
	},
	BOOKING_PRODUCT_INFO (state, value) {
		state.booking.productInfo = value
	},
	BOOKING_FORM_FIRSTNAME (state, value) {
		state.booking.form.firstName = value
	},
	BOOKING_FORM_MIDDLENAME (state, value) {
		state.booking.form.middleName = value
	},
	BOOKING_FORM_SECONDNAME (state, value) {
		state.booking.form.secondName = value
	},
	BOOKING_FORM_EMAIL (state, value) {
		state.booking.form.email= value
	},
	BOOKING_FORM_PHONE (state, value) {
		state.booking.form.phone = value
	},
	BOOKING_FORM_EXTRAINFO (state, value) {
		state.booking.form.getExtraInfo = value
	},
	BOOKING_FORM_NEWSINFO (state, value) {
		state.booking.form.getNewsInfo = value
	},
	BOOKING_FORM_FORANOTHERPERSON (state, value) {
		state.booking.form.forAnotherPerson = value
	},
	BOOKING_FORM_GUESTS (state, value){
		state.booking.form.guests = value
	},
	BOOKING_FORM_CHECKTIME (state, value){
		state.booking.form.checkInTime = value.inTime
		state.booking.form.checkOutTime = value.outTime
	},
	BOOKING_FORM_MOREINFO (state, value){
		state.booking.form.moreInfo = value
	},
	SET_CURRENT_HOTEL (state, value) {
		state.currentHotel = value
	},
	SET_PUSHER_UID (state, value) {
		state.pusherUID = value
	},
	SET_LOCAL_UID (state, value) {
		state.localUID = value
	},
	SET_HOTELS_LIST (state, value) {
		state.hotelsList = value
	},
	SET_SELECTED_HOTEL (state, value) {
		state.selectedHotel = value
	},
	SET_LAST_SEARCH_DATA (state, value) {
		state.lastSearchData = value
	},
	SET_LOCAL_SEARCH_DATA (state, value) {
		state.localSearchData = value
	},
	SET_FORM_DATA (state, data) {
		state.formData = data
	},
	SET_FORM_PLACE_NAME (state, value) {
		state.formData.place = value.name
	},
	SET_FORM_PLACE (state, value) {
		state.formData.place = value.name
		state.formData.location_id = value.id
		state.formData.type = value.type
	},
	SET_FORM_DATE(state, data) {
		state.formData.endDate = data[1]
		state.formData.startDate = data[0]
	},
	SET_FORM_ADULTS(state, value) {
		state.formData.accommodation[0].adults = value
	},
	SET_FORM_STARS(state, data) {
		state.formData.stars = data
	},
	SET_FORM_ROOMS(state, data) {
		state.formData.accommodation = data
	},
	DELETE_FORM_ROOM(state, index) {

	},
	SET_ACTIVE_ROOM(state, data) {
		localStorage.setItem("activeRoom", JSON.stringify(data));
		state.activeRoom = data
	},
	SEARCH_PARAMS_UPDATE(state, data){
		state.formData = data
		state.formData.location_id = data.location_native_id
	},
	UPDATE_REVIEWS(state, data){
		state.reviews = data
	},
	SET_LOCAL_SEARCH_RESULT(state, data){
		state.localSearchResult = data
	},
	LOCAL_LOADING(state, data){
		state.localLoading = data
	},
	SET_SERVICES(state, data){
		state.services = data
	}
}
export const actions = {
	async nuxtServerInit({ commit, state, dispatch },
	                     { app, store, route, req, res, error, redirect }
	) {
		let cookiesSearchData = app.$cookies.get('searchData')
		if (cookiesSearchData) commit('SET_FORM_DATA', cookiesSearchData)
	},
	async personalDataSubmit ({commit}) {
		try {
			commit('BOOKING_STAGE_CHANGE', 'guestsInfo')
		} catch (e) {
			console.log(e)
		}
	},
	async guestInfoSubmit ({commit, state}, data) {
		try {
			commit('BOOKING_STAGE_CHANGE', 'checkinTime')
		} catch (e) {
			console.log(e)
		}
	},
	async checkinTimeSubmit ({commit, state}, data) {
		try {
			commit('BOOKING_STAGE_CHANGE', 'paymentMethods')
		} catch (e) {
			console.log(e)
		}
	},
	async getHotelBySlug ({commit, state}, slug) {
		try{
			let hotel =  await this.$axios.$get(`${process.env.API_URL}hotels/${slug}`)
      console.log("ALO SUKA BLAT")
			commit('SET_CURRENT_HOTEL', hotel)
			return hotel
		} catch(e) {
			console.log(e)
		}
	},
	async getServices ({commit, state}) {
		try{
			let services =  await this.$axios.$get(`${process.env.API_URL}services`)
			commit('SET_SERVICES', services)
			return services
		} catch(e) {
			console.log(e)
		}
	},
	async hotelsSearch ({commit, state}, formData) {
		try{
			const result = await this.$axios.$post(`${process.env.API_URL}search`, formData, {headers: {
					'Content-Type': 'application/json'
				},})
			console.log('result from hotelsSearch', result )
			commit('SET_LOCAL_SEARCH_RESULT', null)
			commit('SET_PUSHER_UID', result.uid)
			commit('SET_LOCAL_SEARCH_DATA', null)
			commit('SET_LAST_SEARCH_DATA', formData)
			if (formData) this.$cookies.set('searchData', formData)
			if (result.uid ) this.$cookies.set('uid', result.uid)
			return result.uid
		} catch (e) {
			console.log(e)
		}
	},
	async staticPageCheck({commit, state}, slug) {
		try {
			const staticPage = await this.$axios.$get(`${process.env.API_URL}page/${slug}`)
			return staticPage
		} catch (e) {
			console.log(e)
		}
	},
	async regionCheck({commit, state}, slug) {
		try {
			const regionPage = await this.$axios.$get(`${process.env.API_URL}regions/${slug}`)
			return regionPage
		} catch (e) {
			console.log(e)
		}
	},
	async cityCheck({commit, state}, slug) {
		try {
			const cityPage = await this.$axios.$get(`${process.env.API_URL}cities/${slug}`)
			return cityPage
		} catch (e) {
			console.log(e)
		}
	},
	async mainPageMeta({commit, state}) {
		try {
			const meta = await this.$axios.$get(`${process.env.API_URL}page`)
			return meta.success ?  meta : {page:{text:''}}
		} catch (e) {
			console.log(e)
		}
	},
	async hotelsSearchLocal ({commit, state, dispatch}, formData) {
		commit('LOCAL_LOADING', true)
		try{
			let searchResult = null
			const result = await this.$axios.$post(`${process.env.API_URL}search`, formData, {headers: {
					'Content-Type': 'application/json'
				},})
			console.log('result from hotelsSearch', result )
			await this.$echo.channel(result.uid).on('search-was-finished', async (e) => {
				try{
					console.log('e.message', e.message)
					searchResult = await this.$axios.$get(`${process.env.API_URL}search/${e.message}`)
					console.log('searchResult', searchResult)
					commit('SET_LOCAL_UID', result.uid)
					commit('SET_LOCAL_SEARCH_RESULT', searchResult.result.data.hotels)
					commit('SET_LOCAL_SEARCH_DATA', formData)
					commit('LOCAL_LOADING', false)
				} catch (e) {
					commit('LOCAL_LOADING', false)
					console.log('hotelsSearchLocal - echo - catch', e)
				}
			})

		} catch (e) {
			commit('LOCAL_LOADING', false)
			console.log(e)
		}
	},
    async createOrder ({commit, state}, formData) {
    try{
      const result = await this.$axios.$post(`${process.env.API_URL}orders/create`, formData, {headers: {
          'Content-Type': 'application/json'
        },})
      console.log('result from createOrder', result )
	    return result
    } catch (e) {
      console.log(e)
    }
  },
	async postReview ({commit, state}, review) {
		try{
			const result = await this.$axios.$post(`${process.env.API_URL}reviews/send`, review, {headers: {
					'Content-Type': 'application/json'
				},})
			return result
		} catch (e) {
			console.log(e)
		}
	},
	async getReviews ({commit}, data) {
		try{
			const reviews = await this.$axios.$get(`${process.env.API_URL}reviews`)
			console.log(reviews)
			commit('UPDATE_REVIEWS', reviews)
			return reviews
		} catch (e) {
			console.log(e)
		}
	},
	async fetchHotels ({commit, state}, data) {
		try{
			const hotels = await this.$axios.$get(`${process.env.API_URL}search/${data}`)
			console.log('hotels', hotels)
			commit('SET_HOTELS_LIST', hotels.result.data.hotels)
			commit('SEARCH_PARAMS_UPDATE', hotels.result.search_params)
			return hotels
		} catch (e) {
			console.log(e)
		}
	},
	async sendFeedback({commit, state}, data) {
		try{
			commit('PRELOADER_TOGGLE', true)
			const result = await this.$axios.$post(`${process.env.API_URL}feedback/send`, data)
			commit('PRELOADER_TOGGLE', false)
			return result

		} catch (e) {
			commit('PRELOADER_TOGGLE', false)
			console.log(e)
		}
	},
	async fetchHotelsByLocationSlug ({commit, state}, data) {
		try{
			const hotels = await this.$axios.$get(`${process.env.API_URL}hotels`, {params: data})
			console.log(hotels)
			commit('SET_HOTELS_LIST', hotels)
			return hotels
		} catch (e) {
			console.log(e)
		}
	},
	async runPusher ({commit, dispatch, state}, UID) {
		commit('PRELOADER_TOGGLE', true)
		await this.$echo.channel(UID).on('search-was-finished', async (e) => {
			await dispatch('fetchHotels', e.message)

			commit('PRELOADER_TOGGLE', false)
			commit('HOTELS_SEARCH_IN_PROGRESS_TOGGLE', false)
		})
	},
	async getPopularLocations ({commit, state}) {
		try{
			return await this.$axios.$get(`${process.env.API_URL}locations/popular`)
		} catch (e) {
			console.log(e)
		}
	},
	async getAllLocations ({commit, state}) {
		try{
			return await this.$axios.$get(`${process.env.API_URL}locations/all`)
		} catch (e) {
			console.log(e)
		}
	}
}
export const getters = {
	getPreloader: state => {
		return state.preloader
	},
	getCurrentHotel: state => {
		return state.currentHotel
	},
	getPusherUID: state => {
		return state.pusherUID
	},
	getHotelsList: state => {
		return state.hotelsList
	},
	getSelectedHotel: state => {
		return state.selectedHotel
	},
	getLastSearchData: state => {
		return state.lastSearchData
	},
	getFormData: state => {
		return state.formData
	},
	getActiveRoom: state => {
		return state.activeRoom
	},
	getHotelsSearchInProgress: state => {
		return state.hotelsSearchInProgress
	},
	getReviews: state => {
		return state.reviews
	},
  getBookingInfo: state => {
    return state.booking
  }
}
