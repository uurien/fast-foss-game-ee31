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
        this.load.image('car0', 'assets/car.png');
        this.load.image('car1', 'assets/car2.png');
        this.load.image('green', 'assets/green.png');
        this.load.image('road', 'assets/road.png');
        this.load.image('recta1', 'assets/recta-1.png');
        this.load.image('recta2', 'assets/recta-2.png');
        this.load.image('recta3', 'assets/recta-3.png');
        this.load.image('recta4', 'assets/recta-4.png');
        this.load.image('curvaex1', 'assets/curva-1.png');
        this.load.image('curvaex2', 'assets/curva-2.png');
        this.load.image('curvaex3', 'assets/curva-3.png');
        this.load.image('curvaex4', 'assets/curva-4.png');
        this.load.image('curvain1', 'assets/curva-5.png');
        this.load.image('curvain2', 'assets/curva-6.png');
    }

    create () {
        this.drawMap()

        this.createUser(0);
        this.createUser(1);

        this.matter.world.setBounds(0, 0, 800, 640);
        this.make

        this.userObjects[0].cursors = this.input.keyboard.createCursorKeys();
        this.userObjects[1].cursors = this.createUserTwoKeys();
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
        const car = this.matter.add.image(userObject.start.x, userObject.start.y, `car${userIndex}`);
        car.setAngle(-90)
        car.setFrictionAir(0.2);
        car.setMass(10);
        this.userObjects[userIndex].car = car;
    }

    update () {
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
                let pictureNumber
                if (map[y] && map[y][x]) {
                    pictureNumber = map[y][x]
                } else {
                    pictureNumber = 0
                }
                switch (pictureNumber) {
                    case 1:
                        this.matter.add.image(16 + x*32, 16 + y*32, 'green', null, { isStatic: true })
                        break;
                    case 2:
                         this.add.image(16 + x*32, 16 + y*32, 'recta1')
                        break;
                    case 3:
                        this.add.image(16 + x*32, 16 + y*32, 'recta2')
                        break;
                    case 4:
                        this.add.image(16 + x*32, 16 + y*32, 'recta3')
                        break;
                    case 5:
                        this.add.image(16 + x*32, 16 + y*32, 'recta4')
                        break;
                    case 6:
                        this.add.image(16 + x*32, 16 + y*32, 'curvaex1')
                        break;
                    case 7:
                        this.add.image(16 + x*32, 16 + y*32, 'curvaex2')
                        break;
                    case 8:
                        this.add.image(16 + x*32, 16 + y*32, 'curvaex3')
                        break;
                    case 9:
                        this.add.image(16 + x*32, 16 + y*32, 'curvaex4')
                        break;
                    case 10:
                        this.add.image(16 + x*32, 16 + y*32, 'curvain1')
                        break;
                    case 11:
                        this.add.image(16 + x*32, 16 + y*32, 'curvain2')
                        break;
                }
                if (pictureNumber === 1) {
                    // const a = this.add.image(16 + x*32, 16 + y*32, 'green')
                    // this.baselayer.add(a)
                }
//                this.platforms.create(16 + x*32, 16 + y*32, 'green').setScale(1).refreshBody();
            }
        }
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