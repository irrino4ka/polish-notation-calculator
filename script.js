const URL = "https://u0byf5fk31.execute-api.eu-west-1.amazonaws.com/etschool/task";

$(document).ready(function () {
    
    let startButton = $("#start").click(() => {
        solveTaskFromEndpoint();
        startButton.addClass('disabled');
        stopButton.removeClass('disabled');
    });

    let stopButton = $("#stop").click(() => {
        stopButton.addClass('disabled');
        startButton.removeClass('disabled');
    })
});

let solveTaskFromEndpoint = () => {
    $.ajax({
        url: URL, success: function (result) {
           
            let calcNumbers = result.expressions.map(calculateExpression);
            $.ajax({
                url: URL,
                type: 'POST',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (resultPost) {

                    if ($("#stop").hasClass('disabled')) {
                        return;
                    }

                    let e = $('div.element:first').clone().css("display", "block");
                    e.insertAfter('div#elements');
                    e.find('.expr-result').text('Expressions: ' + JSON.stringify(result.expressions));
                    e.find('.calc-result').text('Results: ' + JSON.stringify(calcNumbers));
                    e.find('.alert').addClass(function () {
                        return resultPost.passed ? "alert-success" : "alert-danger";
                    });
                    e.find('.alert').text(JSON.stringify(resultPost.passed));

                    solveTaskFromEndpoint();
                },
                data: JSON.stringify({ id: result.id, results: calcNumbers })
            });
        }
    });
}
let calculateExpression = (expr) => {
    let exprTokens = expr.split(' '),
        stack = [],
        token;

    while (token = exprTokens.shift()) {
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
