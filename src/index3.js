
//     const form = document.querySelector('form#ramen-rating');
//     const rating = form.querySelector('input[name="rating"]');
//     const comment = form.querySelector('textarea[name="comment"]');

//     form.addEventListener('submit', function(e){
//         e.preventDefault();
//         let newRating = e.target.rating.value;
//         let newComment = e.target.comment.value;
//         let newRamen = {
//             id: e.target.dataset.id,
//             rating: newRating,
//             comment: newComment
//         }
//         updateDB(newRamen);
//         e.target.reset();
//     })


// function updateDB(newRamen){
//     fetch(`http://localhost:3000/ramens/${newRamen.id}`, {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newRamen),
//     })
//     .then(res => res.json())
//     .then(data => {
//         console.log(data)
//         rating.value = newRamen.rating;
//         comment.textContent = newRamen.comment;
//     })

/////////////////////////////////
const logInBtn = document.querySelector('.logInBtn')
const logInput = document.querySelector('.logInInput')
const signUpForm = document.querySelector('.signup')
const signUpBtn = document.querySelector('input.signBtn')
const handleUser = document.querySelector('.handle-user')
const logInDiv = document.querySelector('.log-in')
const body = document.querySelector('body')
let matchingId;

handleUser.addEventListener("click", signOrLog)

function signOrLog(event) {
    event.preventDefault()
    if (event.target === logInBtn) {
        let logIn = logInput.value
        if (!logIn) {
            alert("Please enter a username.")
        }
        fetch(`http://localhost:3000/users/${logIn}`)
            .then(r => r.json())
            .then(loginUser => {
                window.userId = loginUser.id
                window.userName = loginUser.user_name
                console.log(loginUser)
                console.log(userName)
                renderUserName(logIn, userName)
            })
        function renderUserName(login, userName) {
            if (logIn == userName) {
                handleUser.innerHTML = `
            <h4 class="text" >Logged in as: ${login}</h4></br>
            <button class='log-out' type='button'>Log out</button>`
            }
            const logOutBtn = document.querySelector('.log-out')
            logOutBtn.addEventListener('click', logUserOut)

            function logUserOut() {
                handleUser.innerHTML = `
            <div class="log-in" >
             <h5>Log In</h5>
             <form id="log-in"> 
             <input class="logInInput" type="text" name="Log in">
             <input class="logInBtn" type="submit" value="Log In">
             </form>
           </div>
           <div class="sign-up">
           <form id="sign">
             <h5>Sign Up!</h5>
             <input class="signup" type="text" name="Sign up">
             <input class="signBtn" type="submit" value="Create User">
           </form>
         </div>  
       </div>
           `
            }
        }
    } else if (event.target === signUpBtn) {
        let userInput = signUpForm.value
        userObj = {
            user_name: userInput
        }
        fetch(`http://localhost:3000/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userObj),
        })
            .then(response => response.json())
            .then(data => {
                userName = data.name
                userId = data.id
                console.log('success')
            })
    }
}

// function logInUser(){
//     if()
// }




function stackedCards() {
    var stackedOptions = 'Bottom'; //Change stacked cards view from 'Bottom', 'Top' or 'None'.
    var rotate = true; //Activate the elements' rotation for each move on stacked cards.
    var items = 3; //Number of visible elements when the stacked options are bottom or top.
    var elementsMargin = 10; //Define the distance of each element when the stacked options are bottom or top.
    var useOverlays = true; //Enable or disable the overlays for swipe elements.
    var maxElements; //Total of stacked cards on DOM.
    var currentPosition = 0; //Keep the position of active stacked card.
    var velocity = 0.3; //Minimum velocity allowed to trigger a swipe.
    var topObj; //Keep the swipe top properties.
    var rightObj; //Keep the swipe right properties.
    var leftObj; //Keep the swipe left properties.
    var listElNodesObj; //Keep the list of nodes from stacked cards.
    var listElNodesWidth; //Keep the stacked cards width.
    var currentElementObj; //Keep the stacked card element to swipe.
    var stackedCardsObj;
    var isFirstTime = true;
    var elementHeight;
    var obj;
    var elTrans;


    obj = document.getElementById('stacked-cards-block');
    stackedCardsObj = obj.querySelector('.stackedcards-container');
    listElNodesObj = stackedCardsObj.children;


    topObj = obj.querySelector('.stackedcards-overlay.top');
    rightObj = obj.querySelector('.stackedcards-overlay.right');
    leftObj = obj.querySelector('.stackedcards-overlay.left');

    getRestaurants();
    countElements();
    currentElement();
    changeBackground();
    listElNodesWidth = stackedCardsObj.offsetWidth;
    currentElementObj = listElNodesObj[0];
    updateUi();


    //Prepare elements on DOM
    ////////////////////////////////////////////// APP CODES HERE /////////////////////////////////////////////
    fetch("http://localhost:3000/matching", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: 1 /////////////////NEED LOG IN LOGIC
        }),
    })
        .then(response => response.json())
        .then(data => {
            window.matchingId = data.id
            window.matching = data
            console.log('Matching instance data:', data)
        })


    function getRestaurants() {
        fetch("http://localhost:3000/restaurants")
            .then(resp => resp.json())
            .then(restaurantArray => {
                let newArr = []
                for (i = 0; i < 10; i++) {
                    const random = Math.floor(Math.random() * restaurantArray.length);
                    newItem = restaurantArray[random]
                    newArr.push(newItem)
                }
                window.arrayRest = newArr
                var arrayRest2 = [...arrayRest];
                window.arrayFinal = arrayRest.concat(arrayRest2);
                console.log("MainArray", arrayFinal)


                arrayFinal.forEach(restaurant => renderRestaurant(restaurant))
            })
    }
    function renderRestaurant(restaurantObj) {
        console.log("FETCHED")

        const container = document.querySelector('.stackedcards-container')
        const cardDiv = document.createElement('div')
        cardDiv.className = "card"

        cardDiv.innerHTML += `
                <div class="card-content" id="current-box" data-id="${restaurantObj.id}">
                  <div class="card-image"><img src=${restaurantObj.img_url} width="100%" height="100%"/></div>
                  <div class="card-titles">
                    <h1 class="text" id="rest">${restaurantObj.name}</h1> <!--Restaurant Name---->
                    <h3>${restaurantObj.location}</h3> <!-----Restaurant Location------------->
                  </div>  
                </div>
                <div class="card-footer">
                  <div class="popular-destinations-text">${restaurantObj.cuisine}</div>  <!---------Restaurant rating ----------->
                  <div class="popular-destinations-images">   
                      <!--Rating Star IMG -------------------------------->
                      <!-- Need Photoshop .PNG Stars Preset --------------------------->
                      <div class="circle"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="100%" height="100%"/>
                      <div class="circle"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="100%" height="100%"/>
                      <div class="circle"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="100%" height="100%"/>
                      <div class="circle"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="100%" height="100%"/>
                      <div class="circle"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="100%" height="100%"/>
                      
                    
                    <!---End Rating Star IMG ------------------------------------------->
                  </div>
                </div>
                `
        container.append(cardDiv);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    addMargin = elementsMargin * (items - 1) + 'px';

    if (stackedOptions === "Top") {

        for (i = items; i < maxElements; i++) {
            listElNodesObj[i].classList.add('stackedcards-top', 'stackedcards--animatable', 'stackedcards-origin-top');
        }

        elTrans = elementsMargin * (items - 1);

        stackedCardsObj.style.marginBottom = addMargin;

    } else if (stackedOptions === "Bottom") {


        for (i = items; i < maxElements; i++) {
            listElNodesObj[i].classList.add('stackedcards-bottom', 'stackedcards--animatable', 'stackedcards-origin-bottom');
        }

        elTrans = 0;

        stackedCardsObj.style.marginBottom = addMargin;

    } else if (stackedOptions === "None") {

        for (i = items; i < maxElements; i++) {
            listElNodesObj[i].classList.add('stackedcards-none', 'stackedcards--animatable');
        }

        elTrans = 0;

    }

    for (i = items; i < maxElements; i++) {
        listElNodesObj[i].style.zIndex = 0;
        listElNodesObj[i].style.opacity = 0;
        listElNodesObj[i].style.webkitTransform = 'scale(' + (1 - (items * 0.04)) + ') translateX(0) translateY(' + elTrans + 'px) translateZ(0)';
        listElNodesObj[i].style.transform = 'scale(' + (1 - (items * 0.04)) + ') translateX(0) translateY(' + elTrans + 'px) translateZ(0)';
    }

    if (listElNodesObj[currentPosition]) {
        listElNodesObj[currentPosition].classList.add('stackedcards-active');
    }

    if (useOverlays) {
        leftObj.style.transform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';
        leftObj.style.webkitTransform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';

        rightObj.style.transform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';
        rightObj.style.webkitTransform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';

        topObj.style.transform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';
        topObj.style.webkitTransform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';

    } else {
        leftObj.className = '';
        rightObj.className = '';
        topObj.className = '';

        leftObj.classList.add('stackedcards-overlay-hidden');
        rightObj.classList.add('stackedcards-overlay-hidden');
        topObj.classList.add('stackedcards-overlay-hidden');
    }

    //Remove class init
    setTimeout(function () {
        obj.classList.remove('init');
    }, 150);


    function backToMiddle() {

        removeNoTransition();
        transformUi(0, 0, 1, currentElementObj);

        if (useOverlays) {
            transformUi(0, 0, 0, leftObj);
            transformUi(0, 0, 0, rightObj);
            transformUi(0, 0, 0, topObj);
        }

        setZindex(5);

        if (!(currentPosition >= maxElements)) {
            //roll back the opacity of second element
            if ((currentPosition + 1) < maxElements) {
                listElNodesObj[currentPosition + 1].style.opacity = '.8';
            }
        }
    };

    // Usable functions
    function countElements() {
        maxElements = listElNodesObj.length;

        if (items > maxElements) {
            items = maxElements;
        }
    };

    //Keep the active card.
    function currentElement() {
        currentElementObj = listElNodesObj[currentPosition];
    };

    //Change background for each swipe.
    function changeBackground() {
        document.body.classList.add("background-" + currentPosition + "");
    };

    //Change states
    function changeStages() {
        if (currentPosition == maxElements) {
            //Event listener created to know when transition ends and changes states
            listElNodesObj[maxElements - 1].addEventListener('transitionend', function () {
                document.body.classList.add("background-7");
                document.querySelector('.stage').classList.add('hidden');
                document.querySelector('.final-state').classList.remove('hidden');
                document.querySelector('.final-state').classList.add('active');
                listElNodesObj[maxElements - 1].removeEventListener('transitionend', null, false);
            });
        }
    };

    //Functions to swipe left elements on logic external action.
    function onActionLeft() {
        if (!(currentPosition >= maxElements)) {
            if (useOverlays) {
                leftObj.classList.remove('no-transition');
                topObj.classList.remove('no-transition');
                leftObj.style.zIndex = '8';
                transformUi(0, 0, 1, leftObj);

            }
            setTimeout(function () {
                onSwipeLeft();
                resetOverlayLeft();
            }, 300);
        } if (count <= 11 && count > 2) {

            arrayFinal.shift()
            console.log("Result 1", resultArray)

            count--

        }

        else if (count === 2) {
            alert("It's Player 2's turn!!!")

            arrayFinal.shift()
            console.log("Alert!", arrayFinal)
            count--
        }

        else if (count === 1) {
            arrayFinal.shift()
            console.log("Main Arr", arrayFinal)
        }
        else {
            count--
        }
        console.log(count)

        console.log("MainArr", arrayFinal)


        countElements();
    };

    //Functions to swipe right elements on logic external action.
    let count = 13
    window.resultArray = []
    window.resultArray2 = []
    function onActionRight(event) {
        if (!(currentPosition >= maxElements)) {
            if (useOverlays) {
                rightObj.classList.remove('no-transition');
                topObj.classList.remove('no-transition');
                rightObj.style.zIndex = '8';
                transformUi(0, 0, 1, rightObj);
            }

            setTimeout(function () {
                onSwipeRight();
                resetOverlayRight();
            }, 300);
        }

        if (count <= 11 && count > 2) {
            resultArray.push(arrayFinal[0])
            arrayFinal.shift()
            console.log("Result 1", resultArray)

            count--
        }

        else if (count === 2) {
            alert("It's Player 2's turn!!!")

            resultArray.push(arrayFinal[0])
            arrayFinal.shift()
            console.log("Alert!", resultArray2)
            count--
        }
        else if (count === 1) {
            resultArray2.push(arrayFinal[0])
            arrayFinal.shift()
            console.log("Result 2", resultArray2)
        }
        else {
            count--
        }
        console.log(count)

        console.log("MainArr", arrayFinal)


        // let btn = event.target.parentElement.parentElement.parentElement.children[1].children[0].children[2].children[0].dataset.id
        // arrayRest.shift()
        // console.log(arrayRest)
        countElements()

    };

    //Functions to swipe top elements on logic external action.
    function onActionTop() {
        if (!(currentPosition >= maxElements)) {
            if (useOverlays) {
                leftObj.classList.remove('no-transition');
                rightObj.classList.remove('no-transition');
                topObj.classList.remove('no-transition');
                topObj.style.zIndex = '8';
                transformUi(0, 0, 1, topObj);
            }

            setTimeout(function () {
                onSwipeTop();
                resetOverlays();
            }, 300); //wait animations end
        }
        countElements();
    };

    //Swipe active card to left.
    function onSwipeLeft() {
        removeNoTransition();
        transformUi(-1000, 0, 0, currentElementObj);
        if (useOverlays) {
            transformUi(-1000, 0, 0, leftObj); //Move leftOverlay
            transformUi(-1000, 0, 0, topObj); //Move topOverlay
            resetOverlayLeft();
        }
        currentPosition = currentPosition + 1;
        updateUi();
        currentElement();
        changeBackground();
        changeStages();
        setActiveHidden();
    };

    //Swipe active card to right.
    function onSwipeRight() {
        removeNoTransition();
        transformUi(1000, 0, 0, currentElementObj);
        if (useOverlays) {
            transformUi(1000, 0, 0, rightObj); //Move rightOverlay
            transformUi(1000, 0, 0, topObj); //Move topOverlay
            resetOverlayRight();
        }

        currentPosition = currentPosition + 1;
        updateUi();
        currentElement();
        changeBackground();
        changeStages();
        setActiveHidden();
    };

    //Swipe active card to top.
    function onSwipeTop() {
        removeNoTransition();
        transformUi(0, -1000, 0, currentElementObj);
        if (useOverlays) {
            transformUi(0, -1000, 0, leftObj); //Move leftOverlay
            transformUi(0, -1000, 0, rightObj); //Move rightOverlay
            transformUi(0, -1000, 0, topObj); //Move topOverlay
            resetOverlays();
        }

        currentPosition = currentPosition + 1;
        updateUi();
        currentElement();
        changeBackground();
        changeStages();
        setActiveHidden();
    };

    //Remove transitions from all elements to be moved in each swipe movement to improve perfomance of stacked cards.
    function removeNoTransition() {
        if (listElNodesObj[currentPosition]) {

            if (useOverlays) {
                leftObj.classList.remove('no-transition');
                rightObj.classList.remove('no-transition');
                topObj.classList.remove('no-transition');
            }

            listElNodesObj[currentPosition].classList.remove('no-transition');
            listElNodesObj[currentPosition].style.zIndex = 6;
        }

    };

    //Move the overlay left to initial position.
    function resetOverlayLeft() {
        if (!(currentPosition >= maxElements)) {
            if (useOverlays) {
                setTimeout(function () {

                    if (stackedOptions === "Top") {

                        elTrans = elementsMargin * (items - 1);

                    } else if (stackedOptions === "Bottom" || stackedOptions === "None") {

                        elTrans = 0;

                    }

                    if (!isFirstTime) {

                        leftObj.classList.add('no-transition');
                        topObj.classList.add('no-transition');

                    }

                    requestAnimationFrame(function () {

                        leftObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        leftObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        leftObj.style.opacity = '0';

                        topObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        topObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        topObj.style.opacity = '0';

                    });

                }, 300);

                isFirstTime = false;
            }
        }
    };

    //Move the overlay right to initial position.
    function resetOverlayRight() {
        if (!(currentPosition >= maxElements)) {
            if (useOverlays) {
                setTimeout(function () {

                    if (stackedOptions === "Top") {
                        +2

                        elTrans = elementsMargin * (items - 1);

                    } else if (stackedOptions === "Bottom" || stackedOptions === "None") {

                        elTrans = 0;

                    }

                    if (!isFirstTime) {

                        rightObj.classList.add('no-transition');
                        topObj.classList.add('no-transition');

                    }

                    requestAnimationFrame(function () {

                        rightObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        rightObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        rightObj.style.opacity = '0';

                        topObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        topObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        topObj.style.opacity = '0';

                    });

                }, 300);

                isFirstTime = false;
            }
        }
    };

    //Move the overlays to initial position.
    function resetOverlays() {
        if (!(currentPosition >= maxElements)) {
            if (useOverlays) {

                setTimeout(function () {
                    if (stackedOptions === "Top") {

                        elTrans = elementsMargin * (items - 1);

                    } else if (stackedOptions === "Bottom" || stackedOptions === "None") {

                        elTrans = 0;

                    }

                    if (!isFirstTime) {

                        leftObj.classList.add('no-transition');
                        rightObj.classList.add('no-transition');
                        topObj.classList.add('no-transition');

                    }

                    requestAnimationFrame(function () {

                        leftObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        leftObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        leftObj.style.opacity = '0';

                        rightObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        rightObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        rightObj.style.opacity = '0';

                        topObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        topObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        topObj.style.opacity = '0';

                    });

                }, 300);	// wait for animations time

                isFirstTime = false;
            }
        }
    };

    function setActiveHidden() {
        if (!(currentPosition >= maxElements)) {
            listElNodesObj[currentPosition - 1].classList.remove('stackedcards-active');
            listElNodesObj[currentPosition - 1].classList.add('stackedcards-hidden');
            listElNodesObj[currentPosition].classList.add('stackedcards-active');
            // console.log("Hidden")
        }
    };

    //Set the new z-index for specific card.
    function setZindex(zIndex) {
        if (listElNodesObj[currentPosition]) {
            listElNodesObj[currentPosition].style.zIndex = zIndex;
        }
    };

    // Remove element from the DOM after swipe. To use this method you need to call this function in onSwipeLeft, onSwipeRight and onSwipeTop and put the method just above the variable 'currentPosition = currentPosition + 1'. 
    //On the actions onSwipeLeft, onSwipeRight and onSwipeTop you need to remove the currentPosition variable (currentPosition = currentPosition + 1) and the function setActiveHidden

    function removeElement() {
        currentElementObj.remove();
        if (!(currentPosition >= maxElements)) {
            listElNodesObj[currentPosition].classList.add('stackedcards-active');
        }
    };

    //Add translate X and Y to active card for each frame.
    function transformUi(moveX, moveY, opacity, elementObj) {
        requestAnimationFrame(function () {
            var element = elementObj;

            // Function to generate rotate value 
            function RotateRegulator(value) {
                if (value / 10 > 15) {
                    return 15;
                }
                else if (value / 10 < -15) {
                    return -15;
                }
                return value / 10;
            }

            if (rotate) {
                rotateElement = RotateRegulator(moveX);
            } else {
                rotateElement = 0;
            }

            if (stackedOptions === "Top") {
                elTrans = elementsMargin * (items - 1);
                if (element) {
                    element.style.webkitTransform = "translateX(" + moveX + "px) translateY(" + (moveY + elTrans) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
                    element.style.transform = "translateX(" + moveX + "px) translateY(" + (moveY + elTrans) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
                    element.style.opacity = opacity;
                }
            } else if (stackedOptions === "Bottom" || stackedOptions === "None") {

                if (element) {
                    element.style.webkitTransform = "translateX(" + moveX + "px) translateY(" + (moveY) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
                    element.style.transform = "translateX(" + moveX + "px) translateY(" + (moveY) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
                    element.style.opacity = opacity;
                }

            }
        });
    };

    //Action to update all elements on the DOM for each stacked card.
    function updateUi() {
        requestAnimationFrame(function () {
            elTrans = 0;
            var elZindex = 5;
            var elScale = 1;
            var elOpac = 1;
            var elTransTop = items;
            var elTransInc = elementsMargin;

            for (i = currentPosition; i < (currentPosition + items); i++) {
                if (listElNodesObj[i]) {
                    if (stackedOptions === "Top") {

                        listElNodesObj[i].classList.add('stackedcards-top', 'stackedcards--animatable', 'stackedcards-origin-top');

                        if (useOverlays) {
                            leftObj.classList.add('stackedcards-origin-top');
                            rightObj.classList.add('stackedcards-origin-top');
                            topObj.classList.add('stackedcards-origin-top');
                        }

                        elTrans = elTransInc * elTransTop;
                        elTransTop--;

                    } else if (stackedOptions === "Bottom") {
                        listElNodesObj[i].classList.add('stackedcards-bottom', 'stackedcards--animatable', 'stackedcards-origin-bottom');

                        if (useOverlays) {
                            leftObj.classList.add('stackedcards-origin-bottom');
                            rightObj.classList.add('stackedcards-origin-bottom');
                            topObj.classList.add('stackedcards-origin-bottom');
                        }

                        elTrans = elTrans + elTransInc;

                    } else if (stackedOptions === "None") {

                        listElNodesObj[i].classList.add('stackedcards-none', 'stackedcards--animatable');
                        elTrans = elTrans + elTransInc;

                    }

                    listElNodesObj[i].style.transform = 'scale(' + elScale + ') translateX(0) translateY(' + (elTrans - elTransInc) + 'px) translateZ(0)';
                    listElNodesObj[i].style.webkitTransform = 'scale(' + elScale + ') translateX(0) translateY(' + (elTrans - elTransInc) + 'px) translateZ(0)';
                    listElNodesObj[i].style.opacity = elOpac;
                    listElNodesObj[i].style.zIndex = elZindex;

                    elScale = elScale - 0.04;
                    elOpac = elOpac - (1 / items);
                    elZindex--;
                }
            }

        });

    };

    //Touch events block
    var element = obj;
    var startTime;
    var startX;
    var startY;
    var translateX;
    var translateY;
    var currentX;
    var currentY;
    var touchingElement = false;
    var timeTaken;
    var topOpacity;
    var rightOpacity;
    var leftOpacity;

    function setOverlayOpacity() {

        topOpacity = (((translateY + (elementHeight) / 2) / 100) * -1);
        rightOpacity = translateX / 100;
        leftOpacity = ((translateX / 100) * -1);


        if (topOpacity > 1) {
            topOpacity = 1;
        }

        if (rightOpacity > 1) {
            rightOpacity = 1;
        }

        if (leftOpacity > 1) {
            leftOpacity = 1;
        }
    }

    function gestureStart(evt) {
        startTime = new Date().getTime();

        startX = evt.changedTouches[0].clientX;
        startY = evt.changedTouches[0].clientY;

        currentX = startX;
        currentY = startY;

        setOverlayOpacity();

        touchingElement = true;
        if (!(currentPosition >= maxElements)) {
            if (listElNodesObj[currentPosition]) {
                listElNodesObj[currentPosition].classList.add('no-transition');
                setZindex(6);

                if (useOverlays) {
                    leftObj.classList.add('no-transition');
                    rightObj.classList.add('no-transition');
                    topObj.classList.add('no-transition');
                }

                if ((currentPosition + 1) < maxElements) {
                    listElNodesObj[currentPosition + 1].style.opacity = '1';
                }

                elementHeight = listElNodesObj[currentPosition].offsetHeight / 3;
            }

        }

    };

    function gestureMove(evt) {
        currentX = evt.changedTouches[0].pageX;
        currentY = evt.changedTouches[0].pageY;

        translateX = currentX - startX;
        translateY = currentY - startY;

        setOverlayOpacity();

        if (!(currentPosition >= maxElements)) {
            evt.preventDefault();
            transformUi(translateX, translateY, 1, currentElementObj);

            if (useOverlays) {
                transformUi(translateX, translateY, topOpacity, topObj);

                if (translateX < 0) {
                    transformUi(translateX, translateY, leftOpacity, leftObj);
                    transformUi(0, 0, 0, rightObj);

                } else if (translateX > 0) {
                    transformUi(translateX, translateY, rightOpacity, rightObj);
                    transformUi(0, 0, 0, leftObj);
                }

                if (useOverlays) {
                    leftObj.style.zIndex = 8;
                    rightObj.style.zIndex = 8;
                    topObj.style.zIndex = 7;
                }

            }

        }

    };

    function gestureEnd(evt) {

        if (!touchingElement) {
            return;
        }

        translateX = currentX - startX;
        translateY = currentY - startY;

        timeTaken = new Date().getTime() - startTime;

        touchingElement = false;

        if (!(currentPosition >= maxElements)) {
            if (translateY < (elementHeight * -1) && translateX > ((listElNodesWidth / 2) * -1) && translateX < (listElNodesWidth / 2)) {  //is Top?

                if (translateY < (elementHeight * -1) || (Math.abs(translateY) / timeTaken > velocity)) { // Did It Move To Top?
                    onSwipeTop();
                } else {
                    backToMiddle();
                }

            } else {

                if (translateX < 0) {
                    if (translateX < ((listElNodesWidth / 2) * -1) || (Math.abs(translateX) / timeTaken > velocity)) { // Did It Move To Left?
                        onSwipeLeft();
                    } else {
                        backToMiddle();
                    }
                } else if (translateX > 0) {

                    if (translateX > (listElNodesWidth / 2) && (Math.abs(translateX) / timeTaken > velocity)) { // Did It Move To Right?
                        onSwipeRight();
                    } else {
                        backToMiddle();
                    }

                }
            }
        }
    };

    element.addEventListener('touchstart', gestureStart, false);
    element.addEventListener('touchmove', gestureMove, false);
    element.addEventListener('touchend', gestureEnd, false);

    //Add listeners to call global action for swipe cards
    var buttonLeft = document.querySelector('.left-action');
    var buttonTop = document.querySelector('.top-action');
    var buttonTop2 = document.querySelector('.top-action2');
    var buttonRight = document.querySelector('.right-action');

    // BUTTON LISTENERS ///////////////////////////////////////////////////////////////
    buttonLeft.addEventListener('click', onActionLeft, false);
    // buttonTop.addEventListener('click', onActionTop, false);
    // buttonTop2.addEventListener('click', onActionTop, false);
    buttonRight.addEventListener('click', onActionRight, false);

}

stackedCards();

//****************MATCHING FUNCTION*****************/
const resultBtn = document.querySelector('.result')
let comArray = []
resultBtn.addEventListener('click', () => {


    function commonElement(array1, array2) {
        for (i = 0; i < array1.length; ++i) {
            for (j = 0; j < array2.length; ++j) {
                if (array1[i] == array2[j]) {
                    comArray.push(array1[i])
                }
            }
        }
        return comArray
        console.log(comArray)
    }


    commonElement(resultArray, resultArray2)

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    window.uniqueArray = comArray.filter(onlyUnique);
    console.log(uniqueArray);

    let newMatching = matchingId
    Promise.all(uniqueArray.forEach(restaurant => {
        let newRestId = restaurant.id


        fetch("http://localhost:3000/resto_matchings", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                restaurant_id: newRestId,
                matching_id: newMatching
            }),
        })

            .then(response => response.json())
            .then(newRestoMatch => {
                window.finalMatch = newRestoMatch
                console.log(newRestoMatch)
            })
    }))
    // .then((results) => {
    //     console.log(results)
    //         for(let i = 0; i < results.length; i++) {

    //     }}
    // )


    // uniqueArray.forEach(restaurant => {
    //     // let singleRest = uniqueArray[0].id
    //     let newRestId = restaurant.id
    //     let newMatching = matchingId 
    //     fetch("http://localhost:3000/resto_matchings",{
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             restaurant_id: newRestId,
    //             matching_id: newMatching
    //         }),
    //     })
    //     .then(response => response.json())
    //     .then(newRestoMatch => {
    //         window.finalMatch = newRestoMatch


    //         console.log(newMatching)
    //         console.log('RestoMatching data:', newRestoMatch)
    //         console.log(matching)

    //     })

    // })


    let body = document.querySelector('#body')

    body.innerHTML = ""


    body.innerHTML = `
        <!-- Code Starts Here ------------------------------------------------>
 <div class="handle-user">
   <div class="log-in" >
          <h4 class="text">Logged in as: ${userName}</h4> 
          <button class='log-out' type='button'>Log out</button>   
    </div>
  </div>
 
 <div class="stage">
    <div class="title"><img src="https://lh3.googleusercontent.com/pw/ACtC-3fUnm6RD65mVgOPmLsNaybySYXQWxJ0ckm_86E4nT38s0LvDQWw79K3yp3oGp0UDLmZR51kK2RoOSlG5EtQTKvWZWqLBnOovYaWutDixlCjafeCDx6p5jR9yi3br2MgjPeVnma7dIYlzpqf4kJpTHiW=w678-h108-no?authuser=0" width="100%" height="100%"/></div>
      <div id="stacked-cards-block" class="stackedcards stackedcards--animatable init">
        <div class="stackedcards-container">

            <!-- Square container here ---------------------------------------------------------------->

            <!-- InnerHTML --------------------------------->
         
          <!-- InnerHTML End --------------------------------------------------------------------------->


          <div class="card">
            <div class="card-content">
              <div class="card-image"><img src="https://lh3.googleusercontent.com/pw/ACtC-3dr-32Ax2Sc32JI3C_xmvjyF5Ps_3q1azK_4abjCQIOWrGWYgZ3ZMVjaRxy3CFbIuLOVslvex72rI5mNNYdmVGqsO5XYDYY3Ig5rNK8uNbxhoxLjqxenwcABSx1-yQ3LSr2RQz7TVXrus6SwAPRuh8G=w678-h634-no?authuser=0" width="100%" height="100%"/></div>
              <div class="card-titles">
                <h1></h1>
                <h3></h3>
              </div>  
            </div>
            <div class="card-footer">
              <div class="popular-destinations-text"></div>
              <div class="popular-destinations-images">
                <div class="circle"><img src="https://image.ibb.co/muiA07/beach_chill_1.jpg" width="100%" height="100%"/></div>
                <div class="circle"><img src="https://image.ibb.co/emAOL7/beach_chill_2.jpg" width="100%" height="100%"/></div>
                <div class="circle"><img src="https://image.ibb.co/invq07/beach_chill_3.jpg" width="100%" height="100%"/></div>
              </div>
            </div>
          </div>
          

          <!-- Square Container End here ------------------------------------------------------------------------>
        </div>
        <!-- Overlay ----------------------------------------------------------------------------->
        <div class="stackedcards--animatable stackedcards-overlay top"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png"  width="auto" height="auto"/></div>
        <div class="stackedcards--animatable stackedcards-overlay right"><img src="https://image.ibb.co/dCuESn/Path_3x.png" width="auto" height="auto"/></div>
        <div class="stackedcards--animatable stackedcards-overlay left"><img src="https://image.ibb.co/heTxf7/20_status_close_3x.png" width="auto" height="auto"/></div>
        <!-- End of Overlay ------------------------------------------------------------------------------ -->
    </div>

      <!-- Buttons ------------------------------------------------------------------>
      <div class="global-actions">
          <div class="top-action"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="18" height="16"/></div>
          <div class="left-action"><img src="https://image.ibb.co/heTxf7/20_status_close_3x.png" width="26" height="26"/></div>
          <div class="right-action"><img src="https://image.ibb.co/dCuESn/Path_3x.png" width="30" height="28"/></div>
          <div class="top-action2"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="18" height="16"/></div>
    </div>
    <!--  End of Buttons -------------------------------------------------------------------------------------------------------->
  </div>
  
  <div class="final-state hidden">
    
    <h2>
      Delete this matching</br>
      <button class="delete" type="button" data-id=${matchingId}>Delete</button>
      Try Again</br>
      <button class="Try-Again" type="button">Try Again</button>
    </h2>
      
  </div>

  <!-- Code ends here ---------------->`

    stackedCards2();

})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function stackedCards2() {
    var stackedOptions = 'Bottom'; //Change stacked cards view from 'Bottom', 'Top' or 'None'.
    var rotate = true; //Activate the elements' rotation for each move on stacked cards.
    var items = 3; //Number of visible elements when the stacked options are bottom or top.
    var elementsMargin = 10; //Define the distance of each element when the stacked options are bottom or top.
    var useOverlays = true; //Enable or disable the overlays for swipe elements.
    var maxElements; //Total of stacked cards on DOM.
    var currentPosition = 0; //Keep the position of active stacked card.
    var velocity = 0.3; //Minimum velocity allowed to trigger a swipe.
    var topObj; //Keep the swipe top properties.
    var rightObj; //Keep the swipe right properties.
    var leftObj; //Keep the swipe left properties.
    var listElNodesObj; //Keep the list of nodes from stacked cards.
    var listElNodesWidth; //Keep the stacked cards width.
    var currentElementObj; //Keep the stacked card element to swipe.
    var stackedCardsObj;
    var isFirstTime = true;
    var elementHeight;
    var obj;
    var elTrans;


    obj = document.getElementById('stacked-cards-block');
    stackedCardsObj = obj.querySelector('.stackedcards-container');
    listElNodesObj = stackedCardsObj.children;


    topObj = obj.querySelector('.stackedcards-overlay.top');
    rightObj = obj.querySelector('.stackedcards-overlay.right');
    leftObj = obj.querySelector('.stackedcards-overlay.left');

    // getRestaurants();
    countElements();
    currentElement();
    changeBackground();
    listElNodesWidth = stackedCardsObj.offsetWidth;
    currentElementObj = listElNodesObj[0];
    updateUi();


    //Prepare elements on DOM
    ////////////////////////////////////////////// APP CODES HERE /////////////////////////////////////////////



    uniqueArray.forEach(restaurant => renderRestaurant(restaurant))
    function renderRestaurant(restaurantObj) {
        console.log("FETCHED")

        const container = document.querySelector('.stackedcards-container')
        const cardDiv = document.createElement('div')
        cardDiv.className = "card"

        cardDiv.innerHTML += `
                <div class="card-content" id="current-box" data-id="${restaurantObj.id}">
                  <div class="card-image"><img src=${restaurantObj.img_url} width="100%" height="100%"/></div>
                  <div class="card-titles">
                    <h1 id="rest">${restaurantObj.name}</h1> <!--Restaurant Name---->
                    <h3>${restaurantObj.location}</h3> <!-----Restaurant Location------------->
                  </div>  
                </div>
                <div class="card-footer">
                  <div class="popular-destinations-text">${restaurantObj.rating}</div>  <!---------Restaurant rating ----------->
                  <div class="popular-destinations-images">   
                      <!--Rating Star IMG -------------------------------->
                      <!-- Need Photoshop .PNG Stars Preset --------------------------->
                    <div class="circle"><img src="https://image.ibb.co/jmEYL7/adventure_1.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/nsCynn/adventure_2.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/hmsL07/adventure_3.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/hmsL07/adventure_3.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/hmsL07/adventure_3.jpg" width="100%" height="100%"/></div>
                    <!---End Rating Star IMG ------------------------------------------->
                  </div>
                </div>
                `
        container.append(cardDiv);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    addMargin = elementsMargin * (items - 1) + 'px';

    if (stackedOptions === "Top") {

        for (i = items; i < maxElements; i++) {
            listElNodesObj[i].classList.add('stackedcards-top', 'stackedcards--animatable', 'stackedcards-origin-top');
        }

        elTrans = elementsMargin * (items - 1);

        stackedCardsObj.style.marginBottom = addMargin;

    } else if (stackedOptions === "Bottom") {


        for (i = items; i < maxElements; i++) {
            listElNodesObj[i].classList.add('stackedcards-bottom', 'stackedcards--animatable', 'stackedcards-origin-bottom');
        }

        elTrans = 0;

        stackedCardsObj.style.marginBottom = addMargin;

    } else if (stackedOptions === "None") {

        for (i = items; i < maxElements; i++) {
            listElNodesObj[i].classList.add('stackedcards-none', 'stackedcards--animatable');
        }

        elTrans = 0;

    }

    for (i = items; i < maxElements; i++) {
        listElNodesObj[i].style.zIndex = 0;
        listElNodesObj[i].style.opacity = 0;
        listElNodesObj[i].style.webkitTransform = 'scale(' + (1 - (items * 0.04)) + ') translateX(0) translateY(' + elTrans + 'px) translateZ(0)';
        listElNodesObj[i].style.transform = 'scale(' + (1 - (items * 0.04)) + ') translateX(0) translateY(' + elTrans + 'px) translateZ(0)';
    }

    if (listElNodesObj[currentPosition]) {
        listElNodesObj[currentPosition].classList.add('stackedcards-active');
    }

    if (useOverlays) {
        leftObj.style.transform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';
        leftObj.style.webkitTransform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';

        rightObj.style.transform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';
        rightObj.style.webkitTransform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';

        topObj.style.transform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';
        topObj.style.webkitTransform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';

    } else {
        leftObj.className = '';
        rightObj.className = '';
        topObj.className = '';

        leftObj.classList.add('stackedcards-overlay-hidden');
        rightObj.classList.add('stackedcards-overlay-hidden');
        topObj.classList.add('stackedcards-overlay-hidden');
    }

    //Remove class init
    setTimeout(function () {
        obj.classList.remove('init');
    }, 150);


    function backToMiddle() {

        removeNoTransition();
        transformUi(0, 0, 1, currentElementObj);

        if (useOverlays) {
            transformUi(0, 0, 0, leftObj);
            transformUi(0, 0, 0, rightObj);
            transformUi(0, 0, 0, topObj);
        }

        setZindex(5);

        if (!(currentPosition >= maxElements)) {
            //roll back the opacity of second element
            if ((currentPosition + 1) < maxElements) {
                listElNodesObj[currentPosition + 1].style.opacity = '.8';
            }
        }
    };

    // Usable functions
    function countElements() {
        maxElements = listElNodesObj.length;

        if (items > maxElements) {
            items = maxElements;
        }
    };

    //Keep the active card.
    function currentElement() {
        currentElementObj = listElNodesObj[currentPosition];
    };

    //Change background for each swipe.
    function changeBackground() {
        document.body.classList.add("background-" + currentPosition + "");
    };

    //Change states
    function changeStages() {
        if (currentPosition == maxElements) {
            //Event listener created to know when transition ends and changes states
            listElNodesObj[maxElements - 1].addEventListener('transitionend', function () {
                document.body.classList.add("background-7");
                document.querySelector('.stage').classList.add('hidden');
                document.querySelector('.final-state').classList.remove('hidden');
                document.querySelector('.final-state').classList.add('active');
                listElNodesObj[maxElements - 1].removeEventListener('transitionend', null, false);
            });
        }
    };

    //Functions to swipe left elements on logic external action.
    function onActionLeft() {
        if (!(currentPosition >= maxElements)) {
            if (useOverlays) {
                leftObj.classList.remove('no-transition');
                topObj.classList.remove('no-transition');
                leftObj.style.zIndex = '8';
                transformUi(0, 0, 1, leftObj);

            }
            setTimeout(function () {
                onSwipeLeft();
                resetOverlayLeft();
            }, 300);
        }
        countElements();
    };

    //Functions to swipe right elements on logic external action.
    let count = 13
    window.resultArray = []
    window.resultArray2 = []
    function onActionRight(event) {
        if (!(currentPosition >= maxElements)) {
            if (useOverlays) {
                rightObj.classList.remove('no-transition');
                topObj.classList.remove('no-transition');
                rightObj.style.zIndex = '8';
                transformUi(0, 0, 1, rightObj);
            }

            setTimeout(function () {
                onSwipeRight();
                resetOverlayRight();
            }, 300);
        }


        countElements()

    };

    //Functions to swipe top elements on logic external action.
    function onActionTop() {
        if (!(currentPosition >= maxElements)) {
            if (useOverlays) {
                leftObj.classList.remove('no-transition');
                rightObj.classList.remove('no-transition');
                topObj.classList.remove('no-transition');
                topObj.style.zIndex = '8';
                transformUi(0, 0, 1, topObj);
            }

            setTimeout(function () {
                onSwipeTop();
                resetOverlays();
            }, 300); //wait animations end
        }
        countElements();
    };

    //Swipe active card to left.
    function onSwipeLeft() {
        removeNoTransition();
        transformUi(-1000, 0, 0, currentElementObj);
        if (useOverlays) {
            transformUi(-1000, 0, 0, leftObj); //Move leftOverlay
            transformUi(-1000, 0, 0, topObj); //Move topOverlay
            resetOverlayLeft();
        }
        currentPosition = currentPosition + 1;
        updateUi();
        currentElement();
        changeBackground();
        changeStages();
        setActiveHidden();
    };

    //Swipe active card to right.
    function onSwipeRight() {
        removeNoTransition();
        transformUi(1000, 0, 0, currentElementObj);
        if (useOverlays) {
            transformUi(1000, 0, 0, rightObj); //Move rightOverlay
            transformUi(1000, 0, 0, topObj); //Move topOverlay
            resetOverlayRight();
        }

        currentPosition = currentPosition + 1;
        updateUi();
        currentElement();
        changeBackground();
        changeStages();
        setActiveHidden();
    };

    //Swipe active card to top.
    function onSwipeTop() {
        removeNoTransition();
        transformUi(0, -1000, 0, currentElementObj);
        if (useOverlays) {
            transformUi(0, -1000, 0, leftObj); //Move leftOverlay
            transformUi(0, -1000, 0, rightObj); //Move rightOverlay
            transformUi(0, -1000, 0, topObj); //Move topOverlay
            resetOverlays();
        }

        currentPosition = currentPosition + 1;
        updateUi();
        currentElement();
        changeBackground();
        changeStages();
        setActiveHidden();
    };

    //Remove transitions from all elements to be moved in each swipe movement to improve perfomance of stacked cards.
    function removeNoTransition() {
        if (listElNodesObj[currentPosition]) {

            if (useOverlays) {
                leftObj.classList.remove('no-transition');
                rightObj.classList.remove('no-transition');
                topObj.classList.remove('no-transition');
            }

            listElNodesObj[currentPosition].classList.remove('no-transition');
            listElNodesObj[currentPosition].style.zIndex = 6;
        }

    };

    //Move the overlay left to initial position.
    function resetOverlayLeft() {
        if (!(currentPosition >= maxElements)) {
            if (useOverlays) {
                setTimeout(function () {

                    if (stackedOptions === "Top") {

                        elTrans = elementsMargin * (items - 1);

                    } else if (stackedOptions === "Bottom" || stackedOptions === "None") {

                        elTrans = 0;

                    }

                    if (!isFirstTime) {

                        leftObj.classList.add('no-transition');
                        topObj.classList.add('no-transition');

                    }

                    requestAnimationFrame(function () {

                        leftObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        leftObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        leftObj.style.opacity = '0';

                        topObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        topObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        topObj.style.opacity = '0';

                    });

                }, 300);

                isFirstTime = false;
            }
        }
    };

    //Move the overlay right to initial position.
    function resetOverlayRight() {
        if (!(currentPosition >= maxElements)) {
            if (useOverlays) {
                setTimeout(function () {

                    if (stackedOptions === "Top") {
                        +2

                        elTrans = elementsMargin * (items - 1);

                    } else if (stackedOptions === "Bottom" || stackedOptions === "None") {

                        elTrans = 0;

                    }

                    if (!isFirstTime) {

                        rightObj.classList.add('no-transition');
                        topObj.classList.add('no-transition');

                    }

                    requestAnimationFrame(function () {

                        rightObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        rightObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        rightObj.style.opacity = '0';

                        topObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        topObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        topObj.style.opacity = '0';

                    });

                }, 300);

                isFirstTime = false;
            }
        }
    };

    //Move the overlays to initial position.
    function resetOverlays() {
        if (!(currentPosition >= maxElements)) {
            if (useOverlays) {

                setTimeout(function () {
                    if (stackedOptions === "Top") {

                        elTrans = elementsMargin * (items - 1);

                    } else if (stackedOptions === "Bottom" || stackedOptions === "None") {

                        elTrans = 0;

                    }

                    if (!isFirstTime) {

                        leftObj.classList.add('no-transition');
                        rightObj.classList.add('no-transition');
                        topObj.classList.add('no-transition');

                    }

                    requestAnimationFrame(function () {

                        leftObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        leftObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        leftObj.style.opacity = '0';

                        rightObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        rightObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        rightObj.style.opacity = '0';

                        topObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        topObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                        topObj.style.opacity = '0';

                    });

                }, 300);	// wait for animations time

                isFirstTime = false;
            }
        }
    };

    function setActiveHidden() {
        if (!(currentPosition >= maxElements)) {
            listElNodesObj[currentPosition - 1].classList.remove('stackedcards-active');
            listElNodesObj[currentPosition - 1].classList.add('stackedcards-hidden');
            listElNodesObj[currentPosition].classList.add('stackedcards-active');
            // console.log("Hidden")
        }
    };

    //Set the new z-index for specific card.
    function setZindex(zIndex) {
        if (listElNodesObj[currentPosition]) {
            listElNodesObj[currentPosition].style.zIndex = zIndex;
        }
    };

    // Remove element from the DOM after swipe. To use this method you need to call this function in onSwipeLeft, onSwipeRight and onSwipeTop and put the method just above the variable 'currentPosition = currentPosition + 1'. 
    //On the actions onSwipeLeft, onSwipeRight and onSwipeTop you need to remove the currentPosition variable (currentPosition = currentPosition + 1) and the function setActiveHidden

    function removeElement() {
        currentElementObj.remove();
        if (!(currentPosition >= maxElements)) {
            listElNodesObj[currentPosition].classList.add('stackedcards-active');
        }
    };

    //Add translate X and Y to active card for each frame.
    function transformUi(moveX, moveY, opacity, elementObj) {
        requestAnimationFrame(function () {
            var element = elementObj;

            // Function to generate rotate value 
            function RotateRegulator(value) {
                if (value / 10 > 15) {
                    return 15;
                }
                else if (value / 10 < -15) {
                    return -15;
                }
                return value / 10;
            }

            if (rotate) {
                rotateElement = RotateRegulator(moveX);
            } else {
                rotateElement = 0;
            }

            if (stackedOptions === "Top") {
                elTrans = elementsMargin * (items - 1);
                if (element) {
                    element.style.webkitTransform = "translateX(" + moveX + "px) translateY(" + (moveY + elTrans) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
                    element.style.transform = "translateX(" + moveX + "px) translateY(" + (moveY + elTrans) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
                    element.style.opacity = opacity;
                }
            } else if (stackedOptions === "Bottom" || stackedOptions === "None") {

                if (element) {
                    element.style.webkitTransform = "translateX(" + moveX + "px) translateY(" + (moveY) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
                    element.style.transform = "translateX(" + moveX + "px) translateY(" + (moveY) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
                    element.style.opacity = opacity;
                }

            }
        });
    };

    //Action to update all elements on the DOM for each stacked card.
    function updateUi() {
        requestAnimationFrame(function () {
            elTrans = 0;
            var elZindex = 5;
            var elScale = 1;
            var elOpac = 1;
            var elTransTop = items;
            var elTransInc = elementsMargin;

            for (i = currentPosition; i < (currentPosition + items); i++) {
                if (listElNodesObj[i]) {
                    if (stackedOptions === "Top") {

                        listElNodesObj[i].classList.add('stackedcards-top', 'stackedcards--animatable', 'stackedcards-origin-top');

                        if (useOverlays) {
                            leftObj.classList.add('stackedcards-origin-top');
                            rightObj.classList.add('stackedcards-origin-top');
                            topObj.classList.add('stackedcards-origin-top');
                        }

                        elTrans = elTransInc * elTransTop;
                        elTransTop--;

                    } else if (stackedOptions === "Bottom") {
                        listElNodesObj[i].classList.add('stackedcards-bottom', 'stackedcards--animatable', 'stackedcards-origin-bottom');

                        if (useOverlays) {
                            leftObj.classList.add('stackedcards-origin-bottom');
                            rightObj.classList.add('stackedcards-origin-bottom');
                            topObj.classList.add('stackedcards-origin-bottom');
                        }

                        elTrans = elTrans + elTransInc;

                    } else if (stackedOptions === "None") {

                        listElNodesObj[i].classList.add('stackedcards-none', 'stackedcards--animatable');
                        elTrans = elTrans + elTransInc;

                    }

                    listElNodesObj[i].style.transform = 'scale(' + elScale + ') translateX(0) translateY(' + (elTrans - elTransInc) + 'px) translateZ(0)';
                    listElNodesObj[i].style.webkitTransform = 'scale(' + elScale + ') translateX(0) translateY(' + (elTrans - elTransInc) + 'px) translateZ(0)';
                    listElNodesObj[i].style.opacity = elOpac;
                    listElNodesObj[i].style.zIndex = elZindex;

                    elScale = elScale - 0.04;
                    elOpac = elOpac - (1 / items);
                    elZindex--;
                }
            }

        });

    };

    //Touch events block
    var element = obj;
    var startTime;
    var startX;
    var startY;
    var translateX;
    var translateY;
    var currentX;
    var currentY;
    var touchingElement = false;
    var timeTaken;
    var topOpacity;
    var rightOpacity;
    var leftOpacity;

    function setOverlayOpacity() {

        topOpacity = (((translateY + (elementHeight) / 2) / 100) * -1);
        rightOpacity = translateX / 100;
        leftOpacity = ((translateX / 100) * -1);


        if (topOpacity > 1) {
            topOpacity = 1;
        }

        if (rightOpacity > 1) {
            rightOpacity = 1;
        }

        if (leftOpacity > 1) {
            leftOpacity = 1;
        }
    }

    function gestureStart(evt) {
        startTime = new Date().getTime();

        startX = evt.changedTouches[0].clientX;
        startY = evt.changedTouches[0].clientY;

        currentX = startX;
        currentY = startY;

        setOverlayOpacity();

        touchingElement = true;
        if (!(currentPosition >= maxElements)) {
            if (listElNodesObj[currentPosition]) {
                listElNodesObj[currentPosition].classList.add('no-transition');
                setZindex(6);

                if (useOverlays) {
                    leftObj.classList.add('no-transition');
                    rightObj.classList.add('no-transition');
                    topObj.classList.add('no-transition');
                }

                if ((currentPosition + 1) < maxElements) {
                    listElNodesObj[currentPosition + 1].style.opacity = '1';
                }

                elementHeight = listElNodesObj[currentPosition].offsetHeight / 3;
            }

        }

    };

    function gestureMove(evt) {
        currentX = evt.changedTouches[0].pageX;
        currentY = evt.changedTouches[0].pageY;

        translateX = currentX - startX;
        translateY = currentY - startY;

        setOverlayOpacity();

        if (!(currentPosition >= maxElements)) {
            evt.preventDefault();
            transformUi(translateX, translateY, 1, currentElementObj);

            if (useOverlays) {
                transformUi(translateX, translateY, topOpacity, topObj);

                if (translateX < 0) {
                    transformUi(translateX, translateY, leftOpacity, leftObj);
                    transformUi(0, 0, 0, rightObj);

                } else if (translateX > 0) {
                    transformUi(translateX, translateY, rightOpacity, rightObj);
                    transformUi(0, 0, 0, leftObj);
                }

                if (useOverlays) {
                    leftObj.style.zIndex = 8;
                    rightObj.style.zIndex = 8;
                    topObj.style.zIndex = 7;
                }

            }

        }

    };

    function gestureEnd(evt) {

        if (!touchingElement) {
            return;
        }

        translateX = currentX - startX;
        translateY = currentY - startY;

        timeTaken = new Date().getTime() - startTime;

        touchingElement = false;

        if (!(currentPosition >= maxElements)) {
            if (translateY < (elementHeight * -1) && translateX > ((listElNodesWidth / 2) * -1) && translateX < (listElNodesWidth / 2)) {  //is Top?

                if (translateY < (elementHeight * -1) || (Math.abs(translateY) / timeTaken > velocity)) { // Did It Move To Top?
                    onSwipeTop();
                } else {
                    backToMiddle();
                }

            } else {

                if (translateX < 0) {
                    if (translateX < ((listElNodesWidth / 2) * -1) || (Math.abs(translateX) / timeTaken > velocity)) { // Did It Move To Left?
                        onSwipeLeft();
                    } else {
                        backToMiddle();
                    }
                } else if (translateX > 0) {

                    if (translateX > (listElNodesWidth / 2) && (Math.abs(translateX) / timeTaken > velocity)) { // Did It Move To Right?
                        onSwipeRight();
                    } else {
                        backToMiddle();
                    }

                }
            }
        }
    };

    element.addEventListener('touchstart', gestureStart, false);
    element.addEventListener('touchmove', gestureMove, false);
    element.addEventListener('touchend', gestureEnd, false);

    //Add listeners to call global action for swipe cards
    var buttonLeft = document.querySelector('.left-action');
    var buttonTop = document.querySelector('.top-action');
    var buttonTop2 = document.querySelector('.top-action2');
    var buttonRight = document.querySelector('.right-action');

    // BUTTON LISTENERS ///////////////////////////////////////////////////////////////
    buttonLeft.addEventListener('click', onActionLeft, false);
    buttonTop.addEventListener('click', onActionTop, false);
    buttonTop2.addEventListener('click', onActionTop, false);
    buttonRight.addEventListener('click', onActionRight, false);
    //////////////////////////////////////////////////////////////////////////////////
    const deleteBtn = document.querySelector(".delete")
    const tryAgainBtn = document.querySelector(".Try-Again")

    deleteBtn.addEventListener('click', deleteMatch)
    tryAgainBtn.addEventListener('click', reRandomize)

    function deleteMatch(event) {
        event.target.dataset.id = matching.id
        // debugger
        fetch(`http://localhost:3000/matching/${event.target.dataset.id}`, {
            method: 'DELETE',
        }).then(resp => resp.json())
            .then(data => console.log(data))
    }

    function reRandomize(event) {
        // const hiddenState = document.querySelector('.final-state')
        // document.querySelector('.stage').classList.add('active')
        // hiddenState.classList.remove('active')
        // hiddenState.classList.add('hidden')
        // stackedCards()

        let body = document.querySelector('#body')

        body.innerHTML = ""


        body.innerHTML = `
        <!-- Code Starts Here ------------------------------------------------>
 <div class="handle-user">
   <div class="log-in" >
          <h4 class="text">Logged in as: ${userName}</h4> 
          <button class='log-out' type='button'>Log out</button>   
    </div>
  </div>
 
 <div class="stage">
    <div class="title"><img src="https://lh3.googleusercontent.com/pw/ACtC-3fUnm6RD65mVgOPmLsNaybySYXQWxJ0ckm_86E4nT38s0LvDQWw79K3yp3oGp0UDLmZR51kK2RoOSlG5EtQTKvWZWqLBnOovYaWutDixlCjafeCDx6p5jR9yi3br2MgjPeVnma7dIYlzpqf4kJpTHiW=w678-h108-no?authuser=0" width="100%" height="100%"/></div>
      <div id="stacked-cards-block" class="stackedcards stackedcards--animatable init">
        <div class="stackedcards-container">

            <!-- Square container here ---------------------------------------------------------------->

            <!-- InnerHTML --------------------------------->
         
          <!-- InnerHTML End --------------------------------------------------------------------------->


          <div class="card">
            <div class="card-content">
              <div class="card-image"><img src="https://lh3.googleusercontent.com/pw/ACtC-3dr-32Ax2Sc32JI3C_xmvjyF5Ps_3q1azK_4abjCQIOWrGWYgZ3ZMVjaRxy3CFbIuLOVslvex72rI5mNNYdmVGqsO5XYDYY3Ig5rNK8uNbxhoxLjqxenwcABSx1-yQ3LSr2RQz7TVXrus6SwAPRuh8G=w678-h634-no?authuser=0" width="100%" height="100%"/></div>
              <div class="card-titles">
                <h1></h1>
                <h3></h3>
              </div>  
            </div>
            <div class="card-footer">
              <div class="popular-destinations-text"></div>
              <div class="popular-destinations-images">
                <div class="circle"><img src="https://image.ibb.co/muiA07/beach_chill_1.jpg" width="100%" height="100%"/></div>
                <div class="circle"><img src="https://image.ibb.co/emAOL7/beach_chill_2.jpg" width="100%" height="100%"/></div>
                <div class="circle"><img src="https://image.ibb.co/invq07/beach_chill_3.jpg" width="100%" height="100%"/></div>
              </div>
            </div>
          </div>
          

          <!-- Square Container End here ------------------------------------------------------------------------>
        </div>
        <!-- Overlay ----------------------------------------------------------------------------->
        <div class="stackedcards--animatable stackedcards-overlay top"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png"  width="auto" height="auto"/></div>
        <div class="stackedcards--animatable stackedcards-overlay right"><img src="https://image.ibb.co/dCuESn/Path_3x.png" width="auto" height="auto"/></div>
        <div class="stackedcards--animatable stackedcards-overlay left"><img src="https://image.ibb.co/heTxf7/20_status_close_3x.png" width="auto" height="auto"/></div>
        <!-- End of Overlay ------------------------------------------------------------------------------ -->
    </div>

      <!-- Buttons ------------------------------------------------------------------>
      <div class="global-actions">
          <div class="top-action"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="18" height="16"/></div>
          <div class="left-action"><img src="https://image.ibb.co/heTxf7/20_status_close_3x.png" width="26" height="26"/></div>
          <div class="right-action"><img src="https://image.ibb.co/dCuESn/Path_3x.png" width="30" height="28"/></div>
          <div class="top-action2"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="18" height="16"/></div>
    </div>
    <!--  End of Buttons -------------------------------------------------------------------------------------------------------->
  </div>
  
  <div class="final-state hidden">
    
    <h2>
      Delete this matching</br>
      <button class="delete" type="button" data-id=${matchingId}>Delete</button>
      Try Again</br>
      <button class="Try-Again" type="button">Try Again</button>
    </h2>
      
  </div>

  <!-- Code ends here ---------------->`

        stackedCards();

    }
}
