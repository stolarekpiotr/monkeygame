$(document).ready(function(){
    var that = this;
    var canvas = document.getElementById('board');
    var stage = new Facade(document.querySelector('#board'));
    var boardWidth = canvas.width;
    var boardHeight = canvas.height;
    var board = canvas.getContext("2d");
    var circles = [];
    var counter = 0;
    var start = false;
    var level = 5;
    var levelDisplay = $("#level");
    levelDisplay.text(level);
    that.radius = 25;
    initialize();
    drawBoard();

    function Circle() {
        this.x = 0;
        this.y = 0;
        this.id = circles.length;
        this.checked = true;
        this.circleshape = new Facade.Circle({
            x: 0,
            y: 0,
            radius: that.radius,
            lineWidth: 1,
            strokeStyle: '#333E4B',
            fillStyle: '#1C73A8',
            anchor: 'center'
        });
        this.text = new Facade.Text(this.id+1, {
            x: 0,
            y: 0,
            width: that.radius * 2,
            fontSize: 30,
            anchor: 'center',
            textAlignment: 'center'
        });
        this.draw = function () {
            var group = new Facade.Group({
                x: this.x,
                y: this.y
            });
            group.addToGroup(this.circleshape);
            if (this.checked) {
                group.addToGroup(this.text);
            }
            return group;
        }
        this.reposition = function () {
            var flag, x, y;
            do {
                x = getRandom(that.radius, boardWidth - that.radius);
                y = getRandom(that.radius, boardHeight - that.radius);
                flag = false;
                for (var i = 0; i < this.id; i++) {
                    var element = circles[i];
                    if (distance(x, y, element.x, element.y) <= that.radius * 2.5) {
                        flag = true;
                        break;
                    }
                }
            } while (flag);
            this.x = x;
            this.y = y;
        }
    }

    function initialize() {
        for (var i = 0; i < level; i++) {
            circles.push(new Circle());
        };
        repositionCircles();
    }

    function resetRound() {
        setCirclesCheck(true);
        repositionCircles();
        start = false;
        counter = 0;
    }

    $("#board").click(function (event) {
        for (var i = 0; i < level; i++) {
            var element = circles[i];
            if (distance(event.offsetX, event.offsetY, element.x, element.y) <= that.radius) {
                if (!start) {
                    start = true;
                    setCirclesCheck(false);
                }
                if (element.id === counter) {
                    element.checked = true;
                    counter++;
                    break;
                } else {
                    resetRound();
                }
            }
        }
        if (counter >= circles.length) {
            resetRound();
            addCircle();
            repositionCircles();
        }
        drawBoard();
    });

    function distance(x1, y1, x2, y2) {
        var xdiff = x1 - x2;
        var ydiff = y1 - y2;
        return Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    }

    function getRandom(minimum, maximum) {
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }

    function addCircle() {
        circles.push(new Circle());
        ++level;
    }

    function drawBoard() {
        stage.draw(function () {
            this.clear();
            for (var i = 0; i < level; i++) {
                this.addToStage(circles[i].draw());
            }
        });
    }

    function setCirclesCheck(checked) {
        for (var i = 0; i < level; i++) {
            circles[i].checked = checked;
        }
    }

    function repositionCircles() {
        for (var i = 0; i < level; i++) {
            circles[i].reposition();;
        }
    }
});