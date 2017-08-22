$(document).ready(function () {
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });

    $("#resetButton").on("click", function () {
        level = 1;
        resetRound();
        drawBoard();
        levelDisplay.text(level);
    });

    $("#aboutModal").on('hidden.bs.modal', function (e) {
        $("#aboutModal iframe").attr("src", $("#aboutModal iframe").attr("src"));
    });


    var that = this;
    var canvas = document.getElementById('board');
    var stage = new Facade(document.querySelector('#board'));
    var boardWidth = canvas.width;
    var boardHeight = canvas.height;
    var board = canvas.getContext("2d");
    var circles = [];
    var counter = 0;
    var start = false;
    var minimalDistanceBetweenCirclesFactor = 2.5;
    var level = 1;
    var levelDisplay = $("#level");

    initialize();

    function initialize() {
        levelDisplay.text(level);
        for (var i = 0; i < level; i++) {
            circles.push(new Circle(i));
        };
        repositionCircles();
        drawBoard();
    }

    function repositionCircles() {
        for (var i = 0; i < level; i++) {
            repositionCircle(circles[i]);
        }
    }

    function repositionCircle(circle) {
        var flag, x, y;
        do {
            x = getRandom(circle.radius, boardWidth - circle.radius);
            y = getRandom(circle.radius, boardHeight - circle.radius);
            flag = false;
            for (var i = 0; i < circle.id; i++) {
                var element = circles[i];
                if (distance(x, y, element.x, element.y) <= circle.radius * minimalDistanceBetweenCirclesFactor) {
                    flag = true;
                    break;
                }
            }
        } while (flag);
        circle.x = x;
        circle.y = y;
    }

    function getRandom(minimum, maximum) {
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }

    function distance(x1, y1, x2, y2) {
        var xdiff = x1 - x2;
        var ydiff = y1 - y2;
        return Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    }

    $("#board").click(function (event) {
        for (var i = 0; i < level; i++) {
            var element = circles[i];
            processElement(event, element);
        }
        if (counter >= level) {
            resetRound();
            nextLevel();
            repositionCircles();
        }
        drawBoard();
    });

    function processElement(event, element) {
        if (inRange(event, element)) {
            if (!start) {
                startRound();
            }
            if (element.id === counter) {
                hit(element);
            } else if (element.id <= counter) {

            } else {
                resetRound();
            }
        }
    }

    function inRange(event, element) {
        return distance(event.offsetX, event.offsetY, element.x, element.y) <= element.radius;
    }

    function startRound() {
        start = true;
        setCirclesCheck(false);
    }

    function hit(element) {
        element.checked = true;
        counter++;
    }

    function setCirclesCheck(checked) {
        for (var i = 0; i < level; i++) {
            circles[i].checked = checked;
        }
    }

    function resetRound() {
        setCirclesCheck(true);
        repositionCircles();
        start = false;
        counter = 0;
    }

    function nextLevel() {
        ++level;
        circles.push(new Circle(circles.length));
        levelDisplay.text(level);
    }

    function drawBoard() {
        stage.draw(function () {
            this.clear();
            for (var i = 0; i < level; i++) {
                this.addToStage(circles[i].draw());
            }
        });
    }
});