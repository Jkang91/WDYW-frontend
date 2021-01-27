const restDetail = document.querySelector('#restaurant-detail')
const showMiddle = document.querySelector(".show-middle")
showRestaurants();
// showTenMiddle()

function showRestaurants() {
    fetch("http://localhost:3000/restaurants")
        .then(resp => resp.json())
        .then(restaurantArr => {
            // debugger
            renderRestaurant(restaurantArr.slice(0, 10))
            renderAllRestaurant(restaurantArr)
            showTenMiddle(restaurantArr)
        })
}

function renderRestaurant(Array) {
    restArr = Array
    Array.forEach(restaurant => {
        const div = document.createElement('div')
        div.className = "restaurant"
        const restName = document.createElement('h2')
        restName.className = "rest-name"
        restName.innerText = restaurant.name
        const restLocation = document.createElement('h3')
        restLocation.className = "rest-location"
        restLocation.innerText = restaurant.location
        const restImg = document.createElement('img')
        restImg.src = restaurant.img_url
        restImg.alt = restaurant.name
        const rating = document.createElement('p')
        rating.innerText = restaurant.rating
        div.append(restName, restLocation, restImg, rating)
        showMiddle.append(div)
    })
}

function renderAllRestaurant(Array) {
    restArr = Array
    Array.forEach(restaurant => {
        const div = document.createElement('div')
        div.className = "restaurant"
        const restName = document.createElement('h2')
        restName.className = "rest-name"
        restName.innerText = restaurant.name
        const restLocation = document.createElement('h3')
        restLocation.className = "rest-location"
        restLocation.innerText = restaurant.location
        const restImg = document.createElement('img')
        restImg.src = restaurant.img_url
        restImg.alt = restaurant.name
        const rating = document.createElement('p')
        rating.innerText = restaurant.rating
        div.append(restName, restLocation, restImg, rating)
        restDetail.append(div)

    })
}

function showTenMiddle(Array){
   (Array.slice(0, 10))
   let randomArr = []
   while(Array.length < 11){
   const random = Math.floor(Math.random() * Array.length);
   randomArr.push(random, Array[random]);
   console.log(random, Array[random]);
   }
    

}



