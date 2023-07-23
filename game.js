GAME = typeof GAME === 'undefined' ? {} : GAME;

class FastFossGame23 extends Phaser.Scene {
    userObjects =[{
        vec: Phaser.Physics.Matter.Matter.Vector,
        cursors: undefined,
        car: undefined,
        start: {
            x: 80,
            y: 300
        }
    },
    {
        vec: Phaser.Physics.Matter.Matter.Vector,
        cursors: undefined,
        car: undefined,
        start: {
            x: 110,
            y: 300
        }
    }]

    preload () {
        this.load.image('car-1', 'assets/car-1.png');
        this.load.image('car-2', 'assets/car-2.png');
        this.load.image('lift', 'assets/lift.png');
        this.load.image('column', 'assets/column.png');
        this.load.image('trolley-1', 'assets/trolley-1.png');
        this.load.image('trolley-2', 'assets/trolley-2.png');
        this.load.image('line-1', 'assets/line-1.png');
    }

    create () {
        this.drawMap()

        this.createUser(0);
        this.createUser(1);

        this.matter.world.setBounds(0, 0, 800, 640);

        this.userObjects[0].cursors = this.input.keyboard.createCursorKeys();
        this.userObjects[1].cursors = this.createUserTwoKeys();
        GAME.running = true
        GAME.methods = {
            restart: () => {
                this.restart()
            }
        }
    }

    createUserTwoKeys () {
        const left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        const down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        const right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        const up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        return { left, down, right, up}
    }
    createUser (userIndex) {
        const userObject = this.userObjects[userIndex]
        const car = this.matter.add.image(userObject.start.x, userObject.start.y, `trolley-${userIndex + 1}`);
        car.setAngle(-90)
        car.setFrictionAir(0.2);
        car.setMass(10);
        this.userObjects[userIndex].car = car;
    }

    update () {
        if (!GAME.running) return
        this.updateCar(0)
        this.updateCar(1)
    }

    updateCar (userIndex) {
        const userObject = this.userObjects[userIndex]
        const point1 = userObject.car.getTopRight();
        const point2 = userObject.car.getBottomRight();
        const speed = 0.005;
        const angle = userObject.vec.angle(point1, point2);
        const force = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};

        if (userObject.cursors.up.isDown) {
            userObject.car.thrust(0.01);
            this.steer(userObject.vec.neg(force), userObject);
        } else if (userObject.cursors.down.isDown) {
            userObject.car.thrustBack(0.01);
            this.steer(force, userObject);
        }
    }

    steer(force, userObject) {
        if (userObject.cursors.left.isDown) {
            Phaser.Physics.Matter.Matter.Body.applyForce(userObject.car.body, userObject.car.getTopRight(), force);
        } else if (userObject.cursors.right.isDown) {
            Phaser.Physics.Matter.Matter.Body.applyForce(userObject.car.body, userObject.car.getBottomRight(), userObject.vec.neg(force));
        }
    }

    drawMap () {
        const map = GAME.map;
        // this.baselayer = this.add.layer()
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 25; x++) {
                let fieldId
                if (map[y] && map[y][x]) {
                    fieldId = map[y][x]
                } else {
                    fieldId = 0
                }
                const carId = Math.random() > .5 ? 1 : 2
                let car
                let line
                switch (fieldId) {
                    case 'c1':
                        this.matter.add.image(16 + x*32, 16 + y*32, `car-${carId}`, null, { isStatic: true })
                        break;
                    case 'c2':
                        car = this.matter.add.image(16 + x*32, 16 + y*32, `car-${carId}`, null, { isStatic: true })
                        car.setAngle(-90)
                        break;
                    case 'c3':
                        car = this.matter.add.image(16 + x*32, 16 + y*32, `car-${carId}`, null, { isStatic: true })
                        car.setAngle(180)
                        break;
                    case 'c4':
                        car = this.matter.add.image(16 + x*32, 16 + y*32, `car-${carId}`, null, { isStatic: true })
                        car.setAngle(90)
                        break;
                    case 'li':
                        const lift = this.matter.add.image(16 + x*32, 16 + y*32, `lift`, null, { isStatic: true })
                        lift.setOnCollide((colData) => {
                            this.onCollisionWithLift(colData)
                        })
                        break;
                    case 'cl':
                        this.matter.add.image(16 + x*32, 16 + y*32, `column`, null, { isStatic: true })
                        break;
                    case 'l1':
                        this.add.image(16 + x*32, 16 + y*32, 'line-1')
                        break;
                    case 'l2':
                        line = this.add.image(16 + x*32, 16 + y*32, 'line-1')
                        line.setAngle(180)
                        break;
                    case 'l3':
                        this.add.image(16 + x*32, 16 + y*32, 'line-1')
                    case 'l2':
                        line = this.add.image(16 + x*32, 16 + y*32, 'line-1')
                        line.setAngle(90)
                        break;
                    case 'l4':
                    case 'l2':
                        line = this.add.image(16 + x*32, 16 + y*32, 'line-1')
                        line.setAngle(-90)
                        break;
                }
            }
        }
    }

    onCollisionWithLift (collision) {
        for (let i = 0; i < this.userObjects.length; i++) {
            const { car } = this.userObjects[i]
            if (car.body === collision.bodyA || car.body === collision.bodyB) {
                GAME.running = false
                setTimeout(() => {
                    GAME.uiMethods.showFinish(`Player ${i+1}`)
                    this.restart()
                }, 100)
            }
        }
    }

    restart () {
        for (let i = 0; i < this.userObjects.length; i++) {
            const userObject = this.userObjects[i]
            userObject.car.destroy()
            this.createUser(i)
        }
        setTimeout(() => {
            GAME.running = true
        }, 200)
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            // debug: true,
            enableSleep: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: FastFossGame23
};

const game = new Phaser.Game(config);
