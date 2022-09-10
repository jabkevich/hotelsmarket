




const link= "https://1001-noc.hotelsmarket.ru/hotel/1001-noc/rooms";
const link2= "https://hjbadjhbad.hotelsmarket.ru/hotel/1001-noc/rooms";
const link3= "https://spa-complex-luciano-adadADDвф.hotelsmarket.ru/hotel/1001-noc/rooms";
const link4= "https://hotelsmarket.ru/hotel/1001-noc/rooms";


console.log(link.match(/\/{2}([^.h]*)/))
console.log(link2.match(/(?<=\/\/).+(?=\.h)/)[0])
console.log(link3.match(/(?<=\/\/).+(?=\.h)/)[0])
console.log(link4.match(/(?<=\/\/).+(?=\.h)/))
// console.log(link1.match(/[^\/{2}.]*[^.h]*/))
// console.log(link2.match(/[^\/{2}.]*[^.h]*/))
// console.log(link3.match(/[^\/{2}.]*[^.h]*/))
