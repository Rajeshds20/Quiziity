const fetch = require('node-fetch');

const AllData =
    [
        {
            "question": "Which of the following is NOT a valid JavaScript variable name?",
            "options": [
                "2names",
                "_first_and_last_names",
                "FirstAndLast",
                "None of the above"
            ],
            "correct": 0,
            "explanation": "2names is not a valid variable name."
        }
        ,
        {
            "question": "The credits for these Technical questions goes to?",
            "options": [
                "GitHub",
                "Developer",
                "ChatGPT",
                "Content Writer"
            ],
            "correct": 2,
            "explanation": "if (conditional expression is true) thenexecute this codeend if"
        }
        ,
    ]

AllData.forEach((data, index) => {
    data.correct = data.correct + 1;
})

console.log("Updated The All Data Array");


AllData.forEach((sampleData, index) => {
    fetch('http://localhost:5000/questions/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sampleData)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    setTimeout(() => {
        console.log(index);
    }, 1000);
})

