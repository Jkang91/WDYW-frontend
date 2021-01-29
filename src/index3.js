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
            <h4 class="buttons" >Logged in as: ${login}</h4>
            <button class='log-out buttons' type='button'>Log out</button>`
            }
            const logOutBtn = document.querySelector('.log-out')
            logOutBtn.addEventListener('click', logUserOut)

            function logUserOut() {
                handleUser.innerHTML = `
                <div class="log-in" ></br>
                <form id="log-in"> 
                <input class="logInInput" type="text" name="Log in">
                <input class="logInBtn buttons" type="submit" value="Log In">
                </form>
              </div>
              
              <div class="sign-up">
                <form id="sign"></br>
                  <input class="signup" type="text" name="Sign up">
                  <input class="signBtn buttons" type="submit" value="Sign Up">
                </form>
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
        event.reset()
        }
}




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
            user_id: 1 
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
                    <h3 class="text">${restaurantObj.location}</h3> <!-----Restaurant Location------------->
                    </div>  
                    </div>
                    <div class="card-footer">
                  <div class="popular-destinations-text">${restaurantObj.cuisine}</div>  <!---------Restaurant rating ----------->
                  <div class="popular-destinations-images">   
                      <!--Rating Star IMG -------------------------------->
                      <!-- Need Photoshop .PNG Stars Preset --------------------------->
            
                      <div class="circle"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="100%" height="100%"/></div>
                      <div class="circle"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="100%" height="100%"/></div>
                      <div class="circle"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="100%" height="100%"/></div>
                    
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
                // document.body.classList.add("background-7");
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
    let count = 16
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
        console.log(currentPosition)
        console.log(maxElements)


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
    resultRender();

})
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

 function resultRender(){
    let body = document.querySelector('#body')

    body.innerHTML = ""


    body.innerHTML = `
        <!-- Code Starts Here ------------------------------------------------>
 <div class="handle-user">
   <div class="log-in" >
          <h4 class="buttons">Logged in as: ${userName}</h4> 
          <button class='log-out buttons' type='button'>Log out</button>   
    </div>
  </div>
 
 <div class="stage">
    <div class="title avatar"><img src="https://lh3.googleusercontent.com/pw/ACtC-3fUnm6RD65mVgOPmLsNaybySYXQWxJ0ckm_86E4nT38s0LvDQWw79K3yp3oGp0UDLmZR51kK2RoOSlG5EtQTKvWZWqLBnOovYaWutDixlCjafeCDx6p5jR9yi3br2MgjPeVnma7dIYlzpqf4kJpTHiW=w678-h108-no?authuser=0" width="80%" height="80%"/></div>
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
              <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
              <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
              <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
              <div class="circle event"><img src="data:image/png;base64,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" alt='SweetLandia' id='sweetlandia' width="100%" height="100%"/></div>
          
              <div class="circle event"><img src="data:image/png;base64,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" alt='SweetLandia' id='sweetlandia' width="100%" height="100%"/></div>
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
          
          <div class="left-action"><img src="https://image.ibb.co/heTxf7/20_status_close_3x.png" width="26" height="26"/></div>
          <div class="right-action"><img src="https://image.ibb.co/dCuESn/Path_3x.png" width="30" height="28"/></div>
      
    </div>
    <!--  End of Buttons -------------------------------------------------------------------------------------------------------->
  </div>
  
  <div class="final-state hidden">
    
    <h2>
    
      <button class="View-Again buttons2 avatar" type="button">View Matches Again</button></br>
      or</br>
      <button class="delete buttons2" type="button" data-id=${matchingId}>Delete Matching</button></br>
      or</br>
      <button class="Try-Again buttons2" type="button">Try Again !</button>
    </h2>
      
  </div>

  <!-- Code ends here ---------------->`

    stackedCards2();
 }


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
          <h1 class="text" id="rest">${restaurantObj.name}</h1> <!--Restaurant Name---->
          <h3 class="text">${restaurantObj.location}</h3> <!-----Restaurant Location------------->
          </div>  
          </div>
          <div class="card-footer">
        <div class="popular-destinations-text">${restaurantObj.cuisine}</div>  <!---------Restaurant rating ----------->
        <div class="popular-destinations-images">   
            <!--Rating Star IMG -------------------------------->
            <!-- Need Photoshop .PNG Stars Preset --------------------------->
  
            <div class="circle"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="100%" height="100%"/></div>
            <div class="circle"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="100%" height="100%"/></div>
            <div class="circle"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="100%" height="100%"/></div>
          
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
    var buttonRight = document.querySelector('.right-action');

    // BUTTON LISTENERS ///////////////////////////////////////////////////////////////
    buttonLeft.addEventListener('click', onActionLeft, false);
    buttonRight.addEventListener('click', onActionRight, false);
    //////////////////////////////////////////////////////////////////////////////////
    const deleteBtn = document.querySelector(".delete")
    const tryAgainBtn = document.querySelector(".Try-Again")
    const viewAgainBtn = document.querySelector(".View-Again")

    deleteBtn.addEventListener('click', deleteMatch)
    tryAgainBtn.addEventListener('click', reRandomize)
    viewAgainBtn.addEventListener('click', resultRender)


    function deleteMatch(event) {
        event.target.dataset.id = matching.id
        // debugger
        fetch(`http://localhost:3000/matching/${event.target.dataset.id}`, {
            method: 'DELETE',
        }).then(resp => resp.json())
            .then(data => console.log(data))
            reRandomize();
    }

    function reRandomize(event) {

        let body = document.querySelector('#body')

        body.innerHTML = ""


        body.innerHTML = `
      <!-- Code Starts Here ------------------------------------------------>
      <div class="handle-user">
      <div class="log-in" ></br>
         <form id="log-in"> 
         <input class="logInInput" type="text" name="Log in">
         <input class="logInBtn buttons" type="submit" value="Log In">
         </form>
       </div>
       
       <div class="sign-up">
         <form id="sign"></br>
           <input class="signup" type="text" name="Sign up">
           <input class="signBtn buttons" type="submit" value="Sign Up">
         </form>
       </div>  
     </div>
           
           <div class="stage">
           <div class="title avatar"><img src="https://lh3.googleusercontent.com/pw/ACtC-3dE8lUaK8VLwqbY62nfP48wXxZIy0i-d4ClWTca1iOyBVbqDRE6jdpx9rA8-shc3uARkulwzoubNxPzGP2ALvKfhzM76966ntt2aAfW1laZcnqePVO-tlIf-n3Zagm-k5SqaILGBwJBFgMKSas2IJig=w678-h108-no?authuser=0" width="80%" height="80%"/></div>
             
           
               <div id="stacked-cards-block" class="stackedcards stackedcards--animatable init">
                   <div class="stackedcards-container">
       
                   <!-- Square container here ---------------------------------------------------------------->
       
                 <div class="card">
                   <div class="card-content">
                     <div class="card-image"><img src="https://lh3.googleusercontent.com/pw/ACtC-3dHZj9nh4Is8B_P7mTEqQNKsyLET4bW--hIaw3LFCz7B_WQMiU-fKtTsa4YRXg023E4bxe_mexyjd_8SycJLhzOu5lN21uoIF0L5rTttU2l4DFKDi_7GyLa2c2irgztoh6eJkt6-VQziqLZhjMv5I7Y=w678-h634-no?authuser=0" width="100%" height="100%"/></div>
                     <div class="card-titles">
                       <h1></h1>
                       <h3></h3>
                     </div>  
                   </div>
                   <div class="card-footer">
                     <div class="popular-destinations-text"></div>
                     <div class="popular-destinations-images">
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                   
                       <div class="circle event"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAFZUExURUdwTMZwFMhvEuaOIvKMA8l8I8ZoB/OiE7WKOLV4KsR5I7J1McdyGvGKD+OOJ8ZqC855HMVsDuWCElRSTlpVUFFSVV9XRvOeH9x8Gf2uFvioFP+0HP/AOP+8L/+4Jv/YM//MNf/HOu2bD//cL//GNfbcX//GLOaVD96GCOONCv/SNNV0Au3qw9h+Bv3qav/9y//8q//PLfDu0/+sBf/fYclqBP795/70jP/93P3jSf6fBP/1W//kM/+7Cv/vQf/6m//8tmJdWOF7AfDkherlsvy/J/7pevPfcPyUA//JCf/9wf/91P7VTms1B/DlnLSUUf/YQP/6duDNbK2DOXlGDKB4N+mwIoZZGX5qRcu2YFlEJeDLQKVsD8uqOP/XDZ2KWWRbO3hyY1wjAJtfCM+NG7yXMKyTdYxPBBMUGdLIjbt+Hkg4H8fGrrang5ZwMNbWxoaDeZiXkfHrrpJWiBsAAAAZdFJOUwCNnpb+O+/+ChhJMnjpfdFerMydy+Vwza13ZV2cAAAH1ElEQVRYw+XY6VvaWBQHYFkDiKCtbQfZl6KARhAsskpAFhWEsi8yLEoVd/v/f5hzbnIDWkvbeZ75NCe2CCQvv3O4RGBp6f9ZKvWyRqeTQel0GoVa9S8VhU72iTEYjYlsIms0GphPMp1C/ceMQveJMSaOj4//pnV8nDACpvizMLIVQwIRZzLGfoViY5E4sQyMTPPbLS7LmCAyEfYwdfpFqNOTw1zECVSQkS3/FqPWrSDjZP0iImKpXASpFdlvzGr5XRQca+7k4ODg9IDUF9iwTuH6brhynEhE3/1yVKsQJ/E3pNmFOoXiNbg4Pd3FG09Pct4EhFpd7OjkEKdyuHuCRS2+8NruCdyz6w9BewXZgpmrdAVwQv6TVColUru7p8L/qbNqp3rmT52kcu6FEu+wqZTf70+hxWskBSrlVqlUanXCcG84sEgiTs7vP/TzlSIacqDUUCnVS+NxLQx7hG0o/WTO8mDwOHfIl59ihMs8lEpdbvT09DRqD0tl3CFsCwblb058eQWe91AYKt+fTDr5sIj5U51Sd/R897i39/h49zxqZw5hr1w2GF15YxWocP0UcYd+azwel+qNfj4XFuJNR897dFXuPT49ZWC3cCgRjL5TvzGgaNCeg6qNx/VWq4TWQ22SR2j6dAcArS97z6NMGPYsJqI/jgkby4Zyua/VUr1czWSq5QewxuPOYfhwOnqkzDZ/8TzCh8y73mhOBoGKbIhlc9VMGF7u0GO13Gg1oInM6O4AhG1aqD0NWDaUCxmjhb9ergEFCQTFwlkD/sV6kx5iaJafDrZf1d4j12Fhb3swKte8gKQ4oRCRYrhNSuPSJIZnoq9V7nGW5gg2Ij23Y7BzESO9nFAhaikWi6EIbKEYOLD06r0Y1NfyaI8AR0d3R+QCanv7cViuwgGmYOHFlCTyaNAEtxcRisUirdLVxVWpj1Cs/bxHDp7e399Pvx8JtT26fogUi3ZDVC6bX0OFqMFuJxJWr351cX5RnxBoeIcxvk+/Qd2f0fr+7boLjt0SLcytJQV2ZrdXoFCK9esX5wCRRL3h3fcjOBKdb4NpBussc3Z2f309qNjt5mghPRu3Vl6Imk12mxepSiTJQ1e9WDJJIHCmgzLUoJrL8BUGiOvYXOaNglwrdiaVFzbMLpeNSPFKsnd1Bc55Eqs3nJ6dZTIdAjWquTypTAag4ajnNhsKcnEpqd8BZOEla8VaiScn9auriwiB4sP7cCaT6zRq5XKtUWV5KJ8bXN9ecoOsGaYtDml5h0BuN0Beq9XqjCf755NeMk624SCcz7PVRq1Wa5TZ/GcskIbXdabG9bMApekC0KTljg2LJet2uwMoOa1xkoVUsjaEdli2/FBrQKDPQlVvW5fNTW5kMTjkaXpaWkXISCB3IBBAyRl3xgWo1+3A4WweRjRzQu2uo5llGlzfwMjTdNpahAxCJCwnLSESHs+yEOvzLNB5M+u2wJSCAEnouk57AJqLhKEoBVu3PBNooPpm1p3NOtojBmYkfQ2BFEDJCduMivdvO+wr5/ayCQ+aNTa4zajnBcQIEN8bJrKKkeKT28FcW6EqOrBv1my84SZvQWa3W6QCVrE/yNQddvIsOc2EqoMu9oWBzDCk2hyk9W05GOzNbBYcspwCTivF4s3W7XDQ6VQ75Xa3i3OGMpsJVPCIwwZo0yFC7oBNaE8skKzN83oXq3UDTMBGIItxk2s4tnz06df4tjwCBK8Tl42scK83YPVa58vbhMq68W63y0UCISTf8tEFuazEIRHJ5HK7YEcboayvCp4AK9yM98JuJnCM0BpA9CWi1qc9m8KQTC7MxENeHoOXMWYjV22EgUAuEsiAUFqvFk8jaRzSrDmQXM3L8wuo8xt4pgPUIYwN9zChYwzecDee9Jr4F0nr2xF6EzNlW/XWQ6PReGi16vWLm6abKjMHAgVr3OVs1nCqVe7QSDAmkOw2ew9OuknY4Azeb7TqVzdN21weE3E2gg1uJ70/O9Wq9DQSGRNmssNRLn7qFcQmrXrTa4MHEBxszLDhaLe3ZiPCte2jkXgJQ7nsUHgojxX78CsUMtTZ2OTaaZ90/g+kEpcSMyeBRR0EbHZvRWQEB6BLrpFWvvibLSWRoDmUBMpFMonloozoMA540nxrL99EKGFKryQ7brOCa3ibySzmYRwP3P7+yzcRKozENydIJJRd4ITNxDOi42lzvrVXb21hSqQ5zDRPCZxQAiM4m1tcW/nDu0jJvtAclZASLUEBhsSB+YDj8XFt6Y8fivTYHJFIe0hZzEQzEwMRMQ7m8Wztc+tvfEwizXlId3wo3kKNFiAkDp9na2ef+/jmG/b9mYQUtYw0CmWo4/sJRMaE0owCzEAA8mPgGWhLcNbW37/9oUaQhFDUmhW5EePwjlS9vr60QBJCCRZuaFCFxOEd1dL7D+pfSHPUrBiegTiCs/Txw88+J6tWlT6RIhizAR5DEIGBODs+pRZXtOLDx59/c6CHUDApkXJQAxVkMI6ef4WpPrxf8HFdIoRCi9ccm/gjMj6lhI7m/fqiD+4KqZKk4jHCwYWHKJBGuQavL+Gl+pHTLPxKQ7MGFG9tefDHg7+Bgsz8VxrqRb3xqSR6tFATyoeKXvLqm5HFvfEPptGuASaWUr+m1fxwlPq3vidRqRWrWokUSqJd/ddfRP3HX5b99w/xD245h3O5L18cAAAAAElFTkSuQmCC" alt='SweetLandia' id='sweetlandia' width="100%" height="100%"/></div>
                     </div>
                   </div>
                 </div>
       
                 <div class="card">
                   <div class="card-content">
                     <div class="card-image"><img src="https://lh3.googleusercontent.com/pw/ACtC-3e3An7StAcpIhC0uteXHDUHPeOiU9pd5NxBCPsB7NepgaTDXSU8gFEDeo0MY7DmcpBGwILTK0O5g-mGVdC5U_CePMejGp2HR3r9y_QG04qwV8QOs3GW7kwiYGNmxaSpLO9lgzaoQ-IoW8yBoF0ZK4Px=w678-h634-no?authuser=0" width="100%" height="100%"/></div>
                     <div class="card-titles">
                       <h1><br/></h1>
                       <h3></h3>
                     </div>  
                   </div>
                   <div class="card-footer">
                     <div class="popular-destinations-text"></div>
                     <div class="popular-destinations-images">
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                   
                       <div class="circle event"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAFxUExURUdwTMZvFM97HfmNA8ppA7h8McduEryBMgpn0Mh9Kst8JeONJvGJDslqCMJ0IyFlt1lrhN+AG/CUGeqWJfmiFsdrC9d0DypjsyRcp9x8Gd15CihktSdepndfWKVgLP/cMnTA8P/AK/+5If/4ff/2WfmpE/2xGKVnCP/3bPKgEP/xSv/3i1Or7P7UM/+pBP/5lv/7rf/8ueyZDf/91f/LOOCICP/9x//6omq87z6j6S+W5OWSDNl+Bv/sPonM9v2aA9VzApJVBf+4B//LIf/+5P/laSGI3Rh51P7mNeF7AYFHBP/qemQsAZpeCHc+A4WSe4lOBV217v7aVP/JB201Af/ZEv/RSL2MHe2NA0eR0X57ca16Fv39+fvkWoDH9PC5KOOrLL+iS7qHO3ZqaSFzxM2YHDOFzb2UR+bBMK1xMXNAE2lLN+bQS+vr5kVWcsbCt9TUypjS9cimMNG4On9XJ6KYibWvo5OAZ4FmVZ3X/PPxvCPiIbYAAAAfdFJOUwCPeP7+HKMK/jhLhujwZPlSk8qf8NjMufet5qaj1vxOXcqzAAAHoklEQVRYw9XYiVfaWBQH4ILsVHG0znTWmCiIQgAxyKoBlC0sBURDYRAqYKXQzaXt/Pdz78tisOjYnjlnzvzwHJD3+LjvJXkkefLk34n5yf8rZqPVprfbl5ftdr3NavzO8s1W/fLSM5eLkeJ6trSst367ZbUDkj46OjqWc3R0kAbMbv22YpaJcnxM7a273Wtrbvf6Xh4xsJZtjy4LGB8yexn/9s7h4Z+Qw8Od3XCxg5Tv2fLjqjLanyJDZQKATGdnu5hH6qnd+Ihylvh0+ogqQi07O0ChRp52MIe7HuooneaX/rEoG5STPoBqdnZ3d5Qcys+7+OZ2kcWiFh527HMwLCq8u7u9K2XnNtIb0BDogDT3wwNzbrbz4HQC2yQKRR6yIqd4kPbxD0iknkyAZArTKFKj50EJnYNiIBwOB7SYkoCEhEkHD4fSPfNMnLDf7w9LkbWAWkggIDVgF5TmZs649SlMUMbv8fhJtFhYKcQflhqxV5H28U9n7AXmJXDqHk/RQ+L3yJwiqoaftBeLngzj45eMMyeIK0I8ax45/rtRGtY82LF4gjvBrIExGdJeXCPxrMmk+nlikBTXsF+GmzG4H2BgJxlIsYiH+2088kMT95q7mClC37rLx/9s/qogup4hcbs7k0kHuCmQCJjJpA5dpK5QUtM2XdAc7zup1+udTGe9frkhVMoT9+xcVoSUeAH9OtD9xOWb+3lq6cAZIlCnflktQa477nV4TIW88QpbK+0Jgep3dwE9FESfoHQiNkqVSuqVe12N5iX+NxkJlUYp1cPOJycuXrvhzD/O8S4O3q6ftEsVoXoG5Wytz8gWvu2+KgtCSeihwzE8/6NRO9U8w4HEthsVoTyBT8ghH1YR5c2OKAgN4QIcDsYWsk2PjANpCE67s761h9m6J9CyflkVGhvwCY528nN6dWSmOd5Jg9RNNYT21hbbG4rttji8YPe2yEN5yrMXEI7K721dViuNITgIqbuSEabIyYAkNirtPVZMNUokjarI7qnJX4hlmGYcu9iltq6ERqorQb8ok2T9pUkgeqO0QV2US9C3CsGNU+0pDiUKQFcg8DUCfMNlo9LjaMa12SwoO4Ct0Nx0MiBVKxdcuSGkyiSpVAo2zsVeHkO1Sw2hmkqV4ZESGg2RzbdLQxlSlqUFhFwMzV1eUWKjWr0ev4Ncl1NQValNnPywVKmCc40t42ucIJYVuzTDOAFSZlsvQQzNQuP43fNBLpuN5V5QF1diuSJCNQC1S0IZ5r+Vi2WzucHzd+M2y7E0FISQToZ0CkTTB1eOWG31dH//o/dFHrZWfoIOReWv2pcTmKkX3o/7+6ertZjj1QF0ZyTIdAsFnXD+gtCrl399xL4AHVMU1kLhEwVbH14dA4Tf8vGvlyoU1EKh4KYKwRdC9iVIUtQAtI+tp/v3Q04VWr0DUV9DqwoEIwuGVEifvAdiHwkpk72QDMWV2Z6GWIpVNHjBsncgRoKSyua3JQtxuSRtRQcsgaQ/4lAHdyAXTFE8lFR2SOu8DDFY0akWwk9LNbFaKAKQUlA8kVQOEeOKNNtY0muAIhqIYrvDdnvYlVC1otOXr6WCcIpWjOoyUgjFg05SEkARLdTdeDP+8mX8pg0Up0CRCEJYkHMzDhtN/UXSJxNxqSSGQBEZ4theanzz4e3bDzfjcleFIgRipIJgZPrbpXY+gdvNSSDsFyEQx3ZT4/dv8az27afxBqx8KrRKICeOLGGwaRZ/paT063MCRQjEtcefPkjQh5s3QwkizZHz12mpoFBiRXMioUvKJQEUqakQXf38XoHefynDyipDNQKRGUokddpf7HmpJGf67LxWQ+nU26K5XuXmFvoswMra8uIUQpfzs7STFJScn/rNNmFJIPnOzr1elGTo+vPNp/eQTzefr4WeDNVqXu/5mU8aWNI0fRIBJcG+tEkgkGoyJFTeSKkIAkAMQDV0FCiRNEyfRJjlkgCKRlFa9bYYrifgCi0FFl4CraITjQIkF3Tn1JaUFA/6zgZRIq1GCVTeUCNB0VXiRAdnPuLMf3UWqTOQLUcgkCLRVpq+C9GuVjRCHIB4dAy6ry+KYF+CaTobxGIo1aItH92rpjRQqkunW9EaOrHY4IwUtDLjMsm6AiU1RwChVIu1fAxTrt5C1Q2G8bVikhMbjJo4MNusE+0FHNxokCWSFyAXI96OrVwdMi4Jgg7ZwQgHpp996g/TVAAIpVg0C5Cru1FVnTYcpAAhA79tg1EhaTDdczFi1hkKI0c2ixSBnCiVZacL//pa2Sgy2axjVLjXIdLIkcsRKdvnnU4n0xXJnlQWaTi0nHw/S5xczjFKmh66YNP94bDkkCIQHsZ0dyiKwy4DzCaBkMlZHH+YHrzYNi88t1gGSOX6/CYJrlKwYJAE+zlkchbL84V/umhfdFgsWFSu3wwGg5uawL/NPrYMLBbH4iMu13+1YFGWfjMOCaqJB+PxZt8C1Vgsvxofc5/HvPgTdu4XQqG4NqFQqNDHlp8WzY+8X0SofiEBx4w2iQRCyHzD3ZHF336fNyQhCTn42mD4/TdkHi2Zyb0jm960Mm9QM79i0tu+8x6S2Whd0Ot0JpNOp1/47htR/919tH/J+RveY+Pkupv1zAAAAABJRU5ErkJggg==" alt='SweetLandia' id='sweetlandia' width="100%" height="100%"/></div>
                     </div>
                   </div>
                 </div>
       
       
                 <div class="card">
                   <div class="card-content">
                     <div class="card-image"><img src="https://lh3.googleusercontent.com/pw/ACtC-3dfRGYPr-_zcvk2rWbrm6xrTM7dutFzIXfe9ImSY6tMMzz0tLaA8L9-tLxWaBIOqDTaBFiWalxyRWjJdpia0_Jxs1dWkug_qCPO3nNb_cT_z5eKCZVMhjunMkmTnhZeuvCv4pPe1X_q9i7UDpXPZD-Y=w678-h634-no?authuser=0" width="100%" height="100%"/></div>
                     <div class="card-titles">
                       <h1><br/></h1>
                       <h3></h3>
                     </div>  
                   </div>
                   <div class="card-footer">
                     <div class="popular-destinations-text"></div>
                     <div class="popular-destinations-images">
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                   
                       <div class="circle avatar"><img src="data:image/png;base64,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" width="100%" height="100%"/></div>
                     </div>
                   </div>
                 </div>
       
                 <div class="card">
                   <div class="card-content">
                     <div class="card-image"><img src="https://lh3.googleusercontent.com/pw/ACtC-3evJOsGNopGBaa7kHhU4WVc-6WoT5x7qwtVX7uPOvb8JGA3k6hP8JZTBaQ222vS4DmOSEMIgpvwB26_WeQUi8TLzlv2hZuOMhilXsJ1LFtZpdbrzZ5BMqUlN4cczzJa8OEcYVxjFlwgwvItaRTHAZ53=w678-h634-no?authuser=0" width="100%" height="100%"/></div>
                     <div class="card-titles">
                       <h1><br/></h1>
                       <h3></h3>
                     </div>  
                   </div>
                   <div class="card-footer">
                     <div class="popular-destinations-text"></div>
                     <div class="popular-destinations-images">
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                   
                       <div class="circle event"><img src="data:image/png;base64,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" alt='SweetLandia' id='sweetlandia' width="100%" height="100%"/></div>
                     </div>
                   </div>
                 </div>
       
                 <div class="card">
                   <div class="card-content">
                     <div class="card-image"><img src="https://lh3.googleusercontent.com/pw/ACtC-3dmlH1Y9rU_Kv8AqaHLPhsGqMgiZaCrYsxjkboRw-zUlfoMSsXIkPEMgYx9Qpeh1nPzdA_eVNqdCV8KTqcbamiX9gjvgOIDSN-vd2fA0FiApJ28fnofH3vKm4eRWFtC9q7nrNc8IqBD7WkrtzCzveQP=w678-h634-no?authuser=0" width="100%" height="100%"/></div>
                     <div class="card-titles">
                       <h1><br/></h1>
                       <h3></h3>
                     </div>  
                   </div>
                   <div class="card-footer">
                     <div class="popular-destinations-text"></div>
                     <div class="popular-destinations-images">
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                       <div class="circle"><img src="https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg" width="100%" height="100%"/></div>
                   
                       <div class="circle avatar"><img src="data:image/png;base64,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" width="100%" height="100%"/></div>
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
                 <div class="left-action"><img src="https://image.ibb.co/heTxf7/20_status_close_3x.png" width="26" height="26"/></div>
                 <div class="right-action"><img src="https://image.ibb.co/dCuESn/Path_3x.png" width="30" height="28"/></div>
                
           </div>
           <!--  End of Buttons -------------------------------------------------------------------------------------------------------->
         </div>
         
         
         <div class="final-state hidden">
           
           <h2>
             <p class="avatar"><img src="https://lh3.googleusercontent.com/pw/ACtC-3fUnm6RD65mVgOPmLsNaybySYXQWxJ0ckm_86E4nT38s0LvDQWw79K3yp3oGp0UDLmZR51kK2RoOSlG5EtQTKvWZWqLBnOovYaWutDixlCjafeCDx6p5jR9yi3br2MgjPeVnma7dIYlzpqf4kJpTHiW=w678-h108-no?authuser=0" width="100%" height="100%"/></p></br>
       
             <button class="result buttons2" type="button">Show matches</button></dr>
           
           </h2>
             
         </div>
       
         <!-- Code ends here ---------------->
    `

        stackedCards();

    }
}
