<template>
  <div class="instant-search-container">
    <client-only>
      <ais-instant-search
      :search-client="searchClient"
      index-name="location"
  >
    <ais-configure
        :attributesToSnippet="['bodyPlainTest']"
        :hits-per-page.camel="10"
    >
      <ais-autocomplete>
        <div slot-scope="{ currentRefinement, indices, refine}">
          <input
            :value="searchValue || currentRefinement"
            type="search"
            ref="searchInput"
            @input="searchMethod(refine, '', currentRefinement, indices)"
            class="instant-search"
            @focus="showResults = true"
          >
          <div v-show="currentRefinement.length && showResults" class="autocomplete-container">
            <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div class="relative grid gap-6 bg-gray-900 text-gray-100 px-5 py-6 sm:gap-8 sm:p-8">
                <div  v-for="section in indices" :key="section.objectID" class="divide-y divide-blue-900">
<!--            <div>
                    <h2>{{section.indexName}}</h2>
                  </div>-->
                  <span @click="searchMethod(refine, hit)" class="autocomplete-item" v-for="hit in section.hits.slice().sort((a, b) => a.type > b.type ? 1 : -1)" :key="hit.objectID">

                    <div class="px-2">
                      <div v-if="hit.type==='city'" class="city item">
                        <span class="icon icon-balloon"></span>
                        <div class="inner-container">
                          <ais-highlight attribute="name" :hit="hit" class="name" />
                        <span class="location">{{hit.location}}</span>
                        </div>
                      </div>
                      <div v-else class="hotel item">
                        <ais-highlight attribute="name" :hit="hit" class="name" />
                        <div class="hotel-rating">
                          <span class="rating icon-star" v-for="star of hit.stars"></span>
                        </div>

                        <span class="location">{{hit.location}}</span>
                      </div>

                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ais-autocomplete>
    </ais-configure>
  </ais-instant-search>
    </client-only>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite'
export default {
  name: "InstantSearch",
  data () {
    return {
      ready:false,
      searchValue: null,
      timer: undefined,
      searchClient: algoliasearch(
          process.env.ALGOLIA_APP_ID,
        process.env.ALGOLIA_API_KEY),
      showResults: false,
    }
  },
  computed: {
    searchValueData() {
      return this.$store.state.formData.place
    }
  },
  methods: {
    searchMethod(refine, value, currentRefinement, indices){
      clearTimeout(this.timer)
      if (value) { this.searchValue = value.name } else { this.searchValue = null}
      this.timer = setTimeout(() => {
       refine(this.$refs.searchInput.value)
      }, 500)
      console.log('currentRefinement', currentRefinement)
      console.log('indices', indices)
      if (value) {
        this.$emit('setplace', value)
        this.showResults = false
      }

    },
    searchValueUpdate() {
      this.searchValue = this.$store.state.formData.place
    }
  },
  watch: {
    searchValueData (val) {
      this.searchValueUpdate()
    }
  },
  mounted() {
    if (this.$store.state.formData.place) this.searchValueUpdate()
    this.$nextTick( () => {
      this.ready = true

    })
  },
}
</script>

<style scoped>
.instant-search-container{
  width:295px;
  background: #FFFFFF;
  border-radius: 15px;
  height:47px;
  border:none;
  box-sizing: border-box;
}

.instant-search{
  width:295px;
  background: #FFFFFF;
  border-radius: 15px;
  height:47px;
  border:none;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 10008;
  position: relative;
}
.autocomplete-container{
  position:absolute;
  z-index: 10004;
  background:#FFF;
  width:100%;
  left:0;
  top:35px !important;
  padding:80px 20px 20px;
  box-sizing:border-box;
  box-shadow: 0 10px 10px 2px rgba(0,0,0,0.10);
  border-radius:20px;
}
.autocomplete-container .autocomplete-item{
  font-size:14px;
  line-height:25px;
  color:#000;
  font-weight:300 !important;
  cursor:pointer;
  transition:0.3s ease-in-out;
}
.autocomplete-container .autocomplete-item .px-2{
  border-bottom:1px solid #CCC;
  padding-bottom:5px;
  margin-bottom:5px;
  transition:0.3s ease-in-out;
}
.autocomplete-container .autocomplete-item:last-child .px-2{
  border-bottom:none;
}
.autocomplete-container .autocomplete-item:hover .px-2{
  transform: translateX(5px) !important;
}
.autocomplete-item .item{
  display:flex;
  flex-wrap: wrap;
  align-items: center;
}
.autocomplete-item .item .location{
  display:block;
  min-width:100%;
  font-weight: 300;
  font-size:16px;
}
.autocomplete-item .item .name{
  font-weight:700;
  font-size:16px;
}
.autocomplete-item .item .icon{
  margin-right:15px;
  font-size:18px;
  color:#1F5299;
}
.autocomplete-item .item .hotel-rating{
  display:flex;
  align-items: center;
  margin-left:20px;
}
.autocomplete-item .item .hotel-rating .rating{
  color:#1F5299;
  margin-right:5px;
  font-size:18px;
}
@media(max-width:991px) {
  .autocomplete-container {
    z-index: 10004;
  }
}
</style>
