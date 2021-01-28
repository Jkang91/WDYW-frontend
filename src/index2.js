const logInBtn = document.querySelector('#log-in')
const signUpForm = document.getElementById('sign')
const handleUser = document.querySelector('.handle-user')
const body = document.querySelector('body')
handleUser.addEventListener("submit", signOrLog)

function signOrLog(event){
    event.preventDefault()
    if(event.target === logInBtn){
        logInUser()
    }else if(event.target === signUpBtn){
        let userInput = signUpBtn.inpute


        fetch(`http://localhost:3000/users`, {
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
        })
    }
}

function logInUser(){
    if()
}