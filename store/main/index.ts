import { defineStore } from 'pinia';


export const useFiltersStore = defineStore({
   id: 'filter-store',
   state: () => {
       return {
           filtersList: ['youtube', 'twitch'],
       }
   },
   actions: {
       addValueToFilterList(value: string) {
           this.filtersList.push(value);
       },
   },
   getters: {
       filteredList: state => state.filtersList,
   },
});
