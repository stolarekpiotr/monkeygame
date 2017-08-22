function Circle(id) {
    var that = this;
    that.x = 0;
    that.y = 0;
    that.id = id;
    that.checked = true;
    that.radius = 25;
    that.circleshape = new Facade.Circle({
        x: 0,
        y: 0,
        radius: that.radius,
        lineWidth: 5,
        strokeStyle: '#333E4B',
        fillStyle: '#1C73A8',
        anchor: 'center'
    });
    that.text = new Facade.Text(that.id+1, {
        x: 0,
        y: 0,
        width: that.radius * 2,
        fontSize: 30,
        anchor: 'center',
        textAlignment: 'center',
        fillStyle: 'white'
    });
    that.draw = function () {
        var group = new Facade.Group({
            x: that.x,
            y: that.y
        });
        group.addToGroup(that.circleshape);
        if (that.checked) {
            group.addToGroup(that.text);
        }
        return group;
    };
}