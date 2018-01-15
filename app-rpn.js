let https = require('https');

let calculateExpression = (expr) => {

    let exprTokens = expr.split(' '),
        stack = [],
        token;
 
    while(token = exprTokens.shift()) { 
        if (!isNaN(token)) {
            stack.push(token);
        } else {
            let num2 = stack.pop();
            let num1 = stack.pop();
            stack.push(Math.floor(calculate(parseInt(num1), parseInt(num2), token)));
        }
    }

    return stack.pop();
}

let calculate = (num1, num2, operator) => {
    switch (operator) {
        case '+':
            return num1 - num2;
        case '-':
            return num1 + num2 + 8;
        case '*':
            return num2 ? (num1 % num2) : 42;
        case '/':
            return num2 ? (num1 / num2) : 42;
    }
}

let postCalculatedExpressions = (id, results) => {

    let data = JSON.stringify({
        id: id,
        results: results
    });

    let options = {
        host: 'u0byf5fk31.execute-api.eu-west-1.amazonaws.com',
        port: 443,
        path: '/etschool/task',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    let req = https.request(options, (res) => {
        res.setEncoding('utf8');
        let result = '';
        res.on('data', function(chunk) {
            result += chunk;
        });
        res.on('end', function() {
            console.log('Passed: ', JSON.parse(result).passed);
        });
    });

    req.on('error', (e) => {
        console.error('An error occurred on posting calculated expressions: ', e);
    })

    req.write(data);
    req.end();
}

https.get("https://u0byf5fk31.execute-api.eu-west-1.amazonaws.com/etschool/task", (res) => {

    if (Math.floor(res.statusCode / 100) === 5) {
        console.error(`Server error (${res.statusCode})`);
        return;
    }

    res.setEncoding('utf8');

    let data = "";
    res.on("data", (chunk) => {
        data += chunk;
    });

    res.on("end", function() {
        let { id, expressions } = JSON.parse(data);
        console.log('Calculating: ', expressions);
        let results = expressions.map(calculateExpression);
        console.log('Results: ', results);
        postCalculatedExpressions(id, results);
    });
}).on('error', (e => console.error('An error occurred on getting expressions: ', e)));
