// The point and size class used in this program
function Point(x, y) {
    this.x = (x) ? parseFloat(x) : 0.0;
    this.y = (y) ? parseFloat(y) : 0.0;
}

function Size(w, h) {
    this.w = (w) ? parseFloat(w) : 0.0;
    this.h = (h) ? parseFloat(h) : 0.0;
}

// Helper function for checking intersection between two rectangles
function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
        pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}

// The player class used in this program
function Player() {
    this.node = svgdoc.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
}


Player.prototype.isOnPlatform = function () {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
            ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
            (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            this.position.y + PLAYER_SIZE.h == y) return true;
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}


Player.prototype.isOnPortalOne = function () {
    var portal1 = svgdoc.getElementById("portal1");
    if (portal1.nodeName != "rect") return false;

    var portal1X = parseFloat(portal1.getAttribute("x"));
    var portal1Y = parseFloat(portal1.getAttribute("y"));
    var portal1W = parseFloat(portal1.getAttribute("width"));
    var portalH = parseFloat(portal1.getAttribute("height"));

    if (((this.position.x + PLAYER_SIZE.w > portal1X && this.position.x < portal1X + portal1W) ||
        ((this.position.x + PLAYER_SIZE.w) == portal1X && this.motion == motionType.RIGHT) ||
        (this.position.x == (portal1X + portal1W) && this.motion == motionType.LEFT)) &&
        this.position.y + PLAYER_SIZE.h == portal1Y) return true;

    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}


Player.prototype.isOnPortalTwo = function () {
    var portal2 = svgdoc.getElementById("portal2");
    if (portal2.nodeName != "rect") return false;

    var portal2X = parseFloat(portal2.getAttribute("x"));
    var portal2Y = parseFloat(portal2.getAttribute("y"));
    var portal2W = parseFloat(portal2.getAttribute("width"));
    var porta2H = parseFloat(portal2.getAttribute("height"));

    if (((this.position.x + PLAYER_SIZE.w > portal2X && this.position.x < portal2X + portal2W) ||
        ((this.position.x + PLAYER_SIZE.w) == portal2X && this.motion == motionType.RIGHT) ||
        (this.position.x == (portal2X + portal2W) && this.motion == motionType.LEFT)) &&
        this.position.y + PLAYER_SIZE.h == portal2Y) return true;

    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}



Player.prototype.collidePlatform = function (position) {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, PLAYER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, PLAYER_SIZE, pos, size)) {
                if (this.position.y >= y + h)
                    position.y = y + h;
                else
                    position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}

Player.prototype.collideScreen = function (position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}


//
// Below are constants used in the game
//

var PLAYER_SIZE = new Size(40, 40);         // The size of the player
var SCREEN_SIZE = new Size(600, 560);       // The size of the game screen
var PLAYER_INIT_POS = new Point(0, 420);   // The initial position of the player

var MOVE_DISPLACEMENT = 5;                  // The speed of the player in motion
var JUMP_SPEED = 15;                        // The speed of the player jumping
var VERTICAL_DISPLACEMENT = 1;              // The displacement of vertical speed

var GAME_INTERVAL = 25;                     // The time interval of running the game

var BULLET_SIZE = new Size(10, 10);         // The speed of a bullet
var BULLET_SPEED = 10.0;                    // The speed of a bullet
//  = pixels it moves each game loop
var SHOOT_INTERVAL = 200.0;                 // The period when shooting is disabled
var canShoot = true;                        // A flag indicating whether the player can shoot a bullet

var MONSTER_SIZE = new Size(40, 40);        // The speed of a bullet

var MUSHROOM_SIZE = new Size(40, 40);


//
// Variables in the game
//
var motionKeep = { NONE: 0, LEFT: 1, RIGHT: 2 };
var motionType = { NONE: 0, LEFT: 1, RIGHT: 2 }; // Motion enum

var svgdoc = null;                          // SVG root document node
var player = null;                          // The player object
var gameInterval = null;                    // The interval
var zoom = 1.0;                             // The zoom level of the screen
var score = 0;                              // The score of the game
var gameTimeout = null;


var playerName = null;
var bulletCount = 8;
var mushroomCount = 8;
var timeRemain = 60;
var portalIn = false;
var opacityValue1 = 1.0;
var opacityValue2 = 1.0;
var opacityValue3 = 1.0;
var cheatMode = false;
var exiting = false;
var monsterBulletCount = 0;
var backgmusic;


function randomPoint() {
    var pt = new Point(Math.floor(Math.random() * 560), Math.floor(Math.random() * 520));
    return pt;
}

//
// The load function for the SVG document
//
function load(evt) {

    // Set the root node to the global variable
    svgdoc = evt.target.ownerDocument;

    // Attach keyboard events
    svgdoc.documentElement.addEventListener("keydown", keydown, false);
    svgdoc.documentElement.addEventListener("keyup", keyup, false);

    // Remove text nodes in the 'platforms' group
    cleanUpGroup("platforms", true);

    // Create the player
    player = new Player();

    startGame();
}

function startGame() {
    backgmusic = new Audio("bgmusic.mp3");
    // Create the monsters
    for (var i = 0; i < 6; i++) {

        do {
            var randomX = Math.floor(Math.random() * 560);
            var randomY = Math.floor(Math.random() * 520);
        } while (randomX - player.position.x < 200 && randomY - player.position.y < 200);

        var pos = new Point(randomX, randomY);
        createMonster(pos);
    }

    do {
        var randomX = Math.floor(Math.random() * 560);
        var randomY = Math.floor(Math.random() * 520);
    } while (randomX - player.position.x < 200 && randomY - player.position.y < 200);

    var pos = new Point(randomX, randomY);


    // Create a disappearing platform
    var newPlatform1 = svgdoc.createElementNS("http://www.w3.org/2000/svg", "rect");
    newPlatform1.setAttribute("x", 400);
    newPlatform1.setAttribute("y", 280);
    newPlatform1.setAttribute("width", 100);
    newPlatform1.setAttribute("height", 20);
    newPlatform1.setAttribute("style", "fill:green;fill-opacity:" + opacityValue1);
    newPlatform1.setAttribute("id", "disappearing1");
    svgdoc.getElementById("platforms").appendChild(newPlatform1);

    var newPlatform2 = svgdoc.createElementNS("http://www.w3.org/2000/svg", "rect");
    newPlatform2.setAttribute("x", 300);
    newPlatform2.setAttribute("y", 80);
    newPlatform2.setAttribute("width", 140);
    newPlatform2.setAttribute("height", 20);
    newPlatform2.setAttribute("style", "fill:green;fill-opacity:" + opacityValue2);
    newPlatform2.setAttribute("id", "disappearing2");
    svgdoc.getElementById("platforms").appendChild(newPlatform2);

    var newPlatform3 = svgdoc.createElementNS("http://www.w3.org/2000/svg", "rect");
    newPlatform3.setAttribute("x", 260);
    newPlatform3.setAttribute("y", 440);
    newPlatform3.setAttribute("width", 100);
    newPlatform3.setAttribute("height", 20);
    newPlatform3.setAttribute("style", "fill:green;fill-opacity:" + opacityValue3);
    newPlatform3.setAttribute("id", "disappearing3");
    svgdoc.getElementById("platforms").appendChild(newPlatform3);


    // create mushrooms
    for (var i = 0; i < 8; i++) {
        // var mushroomP = createNewPolyPoint(MUSHROOM_SIZE.w);
        // createMushroom(mushroomP[0], mushroomP[1]);
        createMushroom();
    }
}



function removePlatform(node, value) {
    node.setAttribute("style", "fill-opacity:" + value);
}


function timeCount() {
    if (timeRemain > 0) {
        timeRemain--;
        // time number
        svgdoc.getElementById("timeLeft").firstChild.data = timeRemain + "s";

        // time bar
        svgdoc.getElementById("timeFill").setAttribute("width", (140 * (timeRemain / 60)));
    }
}



//
// This function removes all/certain nodes under a group
//
function cleanUpGroup(id, textOnly) {
    var node, next;
    var group = svgdoc.getElementById(id);
    node = group.firstChild;
    while (node != null) {
        next = node.nextSibling;
        if (!textOnly || node.nodeType == 3) // A text node
            group.removeChild(node);
        node = next;
    }
}

//
// This function creates the mushrooms in the game
//
function createMushroom() {
    var mushroom = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    var platforms = svgdoc.getElementById("platforms");
    var placeMush = false;
    var mushroomXY = new Point(Math.random() * 520, Math.random() * 500);

    while (!placeMush) {
        placeMush = true;
        mushroomXY = new Point(Math.random() * 560, Math.random() * 520);

        //check collision with platform
        for (var i = 0; i < platforms.childNodes.length; i++) {
            var node = platforms.childNodes.item(i);
            if (node.nodeName != "rect") continue;

            var x = parseFloat(node.getAttribute("x"));
            var y = parseFloat(node.getAttribute("y"));
            var w = parseFloat(node.getAttribute("width"));
            var h = parseFloat(node.getAttribute("height"));
            var pos = new Point(x, y);
            var size = new Size(w, h);
            if (intersect(mushroomXY, new Size(50, 50), pos, size)) {
                placeMush = false;
                break;
            }
        }
    }

    mushroom.setAttribute("x", mushroomXY.x);
    mushroom.setAttribute("y", mushroomXY.y);
    mushroom.setAttribute("width", MUSHROOM_SIZE.w);
    mushroom.setAttribute("height", MUSHROOM_SIZE.h);
    mushroom.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#mushroom");
    svgdoc.getElementById("mushrooms").appendChild(mushroom);

}

//
// This function creates the monsters in the game
//
function createMonster(pos) {
    var monster = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    // initial position
    monster.setAttribute("x", pos.x);
    monster.setAttribute("y", pos.y);

    // moving point
    var movement = randomPoint();

    // generate new point if intersect with the player
    while (intersect(pos, new Size(160, 160), player.position, PLAYER_SIZE))
        movement = randomPoint();

    monster.setAttribute("Dx", movement.x);
    monster.setAttribute("Dy", movement.y);

    // flip the monster
    if (movement.x - pos.x > 0) {
        monster.setAttribute("isFlip", 1);
        monster.setAttribute("isNegPos", 0);
    } else {
        monster.setAttribute("isFlip", 0);
        monster.setAttribute("isNegPos", 1);
    }

    // only the first monster created can shoot
    if (svgdoc.getElementById("monsters").childNodes.length > 0)
        monster.setAttribute("canShoot", true);
    else
        monster.setAttribute("canShoot", false);

    monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
    svgdoc.getElementById("monsters").appendChild(monster);
}


//
// This function shoots a bullet from the player
//
function shootBullet() {
    // cheat mode on
    if (cheatMode) {
        // Disable shooting for a short period of time
        canShoot = false;
        setTimeout("canShoot = true", SHOOT_INTERVAL);
        svgdoc.getElementById("bulletLeft").firstChild.data = bulletCount;

        // Create the bullet using the use node
        var bullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
        bullet.setAttribute("x", player.position.x + PLAYER_SIZE.w / 2 - BULLET_SIZE.w / 2);
        bullet.setAttribute("y", player.position.y + PLAYER_SIZE.h / 2 - BULLET_SIZE.h / 2);
        bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
        svgdoc.getElementById("bullets").appendChild(bullet);
        // shoot in one direction
        svgdoc.getElementById("bullets").lastChild.data = motionKeep;

        // sound
        var shooting = new Audio("shoot.wav");
        shooting.play();

        // cheat mode off and valid shoot
    } else if (bulletCount > 0) {
        canShoot = false;
        setTimeout("canShoot = true", SHOOT_INTERVAL);
        bulletCount--;
        svgdoc.getElementById("bulletLeft").firstChild.data = bulletCount;

        // Create the bullet using the use node
        var bullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
        bullet.setAttribute("x", player.position.x + PLAYER_SIZE.w / 2 - BULLET_SIZE.w / 2);
        bullet.setAttribute("y", player.position.y + PLAYER_SIZE.h / 2 - BULLET_SIZE.h / 2);
        bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
        svgdoc.getElementById("bullets").appendChild(bullet);
        svgdoc.getElementById("bullets").lastChild.data = motionKeep;

        // sound
        var shooting = new Audio("shoot.wav");
        shooting.play();
    }

}

//
// This function shoots a bullet from the monster
//
function shootMonsterBullet() {
    var node = svgdoc.getElementById("monsters").childNodes.item(0);
    var xPos = parseInt(node.getAttribute("x"));
    var yPos = parseInt(node.getAttribute("y"));
    var monsterBullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    monsterBullet.setAttribute("id", "monsterBullet");
    monsterBullet.setAttribute("x", xPos + MONSTER_SIZE.w / 2);
    monsterBullet.setAttribute("y", yPos + MONSTER_SIZE.h / 2);

    if (node.getAttribute("isNegPos") == 1) {
        monsterBullet.data = motionType.LEFT;
    } else if (node.getAttribute("isNegPos") != 1) {
        monsterBullet.data = motionType.RIGHT;
    }

    monsterBulletCount++;
    monsterBullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
    svgdoc.getElementById("bullets").appendChild(monsterBullet);

}

//
// This is the keydown handling function for the SVG document
//
function keydown(evt) {
    var keyCode = (evt.keyCode) ? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            player.motion = motionType.LEFT;
            motionKeep = motionType.LEFT;
            break;

        case "D".charCodeAt(0):
            player.motion = motionType.RIGHT;
            motionKeep = motionType.RIGHT;
            break;

        case "W".charCodeAt(0):
            if (cheatMode == false) {
                if (player.isOnPlatform()) {
                    player.verticalSpeed = JUMP_SPEED;
                }
            } else {
                player.verticalSpeed = JUMP_SPEED;
            }
            break;

        // space
        case 32:
            if (canShoot)
                shootBullet();
            break;

        // cheat mode on
        case "C".charCodeAt(0):
            cheatMode = true;
            player.node.setAttribute("style", "fill-opacity:0.5");
            break;

        // cheat mode off
        case "V".charCodeAt(0):
            cheatMode = false;
            player.node.setAttribute("style", "fill-opacity:1");
            break;
    }
}


//
// This is the keyup handling function for the SVG document
//
function keyup(evt) {
    // Get the key code
    var keyCode = (evt.keyCode) ? evt.keyCode : evt.getKeyCode();

    // keep facing in correct direction
    switch (keyCode) {
        case "A".charCodeAt(0):
            if (player.motion == motionType.LEFT) player.motion = motionType.NONE;
            break;

        case "D".charCodeAt(0):motionType.NONE;
            if (player.motion == motionType.RIGHT) player.motion = motionType.NONE;
            break;
    }
}


function endGame() {
    // Clear the game interval
    clearInterval(gameInterval);
    clearInterval(gameTimeout);

    // Get the high score table from cookies
    var table = getHighScoreTable();

    if (zoom == 2.0) {
        score += timeRemain * 2;
    } else {
        score += timeRemain;
    }

    // Create the new score record
    // var name = prompt("What is your name?", "abc");
    var record = new ScoreRecord(playerName, score);
    // Insert the new score record
    var pos = table.length;

    for (var i = 0; i < table.length; i++) {
        if (record.score > table[i].score) {
            pos = i;
            break;
        }
    }

    table.splice(pos, 0, record);

    // Store the new high score table
    setHighScoreTable(table);

    // Show the high score table
    showHighScoreTable(table);
    return;
}

//
// This function checks collision
//
function collisionDetection() {
    // parseInt(exitPos.getAttribute("x"))
    // Check whether the player collides with a monster
    var monsters = svgdoc.getElementById("monsters");
    var exitPos = svgdoc.getElementById("exit");
    var mushrooms = svgdoc.getElementById("mushrooms");
    var bullets = svgdoc.getElementById("bullets");

    // enter exit & picking up all mushrooms
    if (mushroomCount == 0 && player.position.x + PLAYER_SIZE.w >= parseInt(exitPos.getAttribute("x")) && player.position.y + PLAYER_SIZE.h == parseInt(exitPos.getAttribute("x")) - PLAYER_SIZE.h / 2) {
        exiting = true;
        backgmusic.pause();
        var exit = new Audio("exit.mp3");
        exit.play();
        endGame();
        return;
    }

    // touch by a monster
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var monster = monsters.childNodes.item(i);
        var x = parseInt(monster.getAttribute("x"));
        var y = parseInt(monster.getAttribute("y"));
        if (cheatMode == false)
            if (intersect(new Point(x, y), MONSTER_SIZE, player.position, PLAYER_SIZE)) {
                backgmusic.pause();
                var ending = new Audio("badend.wav");
                ending.play();
                endGame();
                return;
            }

    }

    // time's up
    if (timeRemain == 0) {
        backgmusic.pause();
        var badEnd = new Audio("badend.wav");
        badEnd.play();
        endGame();
        return;
    }

    // Check whether a bullet hits a monster
    var bullets = svgdoc.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var bullet = bullets.childNodes.item(i);
        var x = parseInt(bullet.getAttribute("x"));
        var y = parseInt(bullet.getAttribute("y"));
        if (bullet.getAttribute("id") != "monsterBullet") {
            for (var j = 0; j < monsters.childNodes.length; j++) {
                var monster = monsters.childNodes.item(j);
                var mx = parseInt(monster.getAttribute("x"));
                var my = parseInt(monster.getAttribute("y"));

                if (intersect(new Point(x, y), BULLET_SIZE, new Point(mx, my), MONSTER_SIZE)) {
                    monsters.removeChild(monster);
                    j--;
                    bullets.removeChild(bullet);
                    i--;

                    if (zoom == 2.0)
                        score += 10 * 3;
                    else
                        score += 10;

                    svgdoc.getElementById("score").firstChild.data = score;
                    var monsterdying = new Audio("monsterdie.wav");
                    monsterdying.play();
                }
            }
        } else {
            // hit by monster bullet
            var monsterB = new Point(bullet.getAttribute("x"), bullet.getAttribute("y"));
            if (intersect(monsterB, BULLET_SIZE, player.position, PLAYER_SIZE) && cheatMode == false) {
                endGame();
                document.getElementById("badend").play();
                var ending = new Audio("badend.wav");
                ending.play();
            }
        }
    }

    // pick up mushroom
    for (var i = 0; i < mushrooms.childNodes.length; i++) {
        var mushroom = mushrooms.childNodes.item(i);
        var x = parseInt(mushroom.getAttribute("x"));
        var y = parseInt(mushroom.getAttribute("y"));

        if (intersect(new Point(x, y), MUSHROOM_SIZE, player.position, PLAYER_SIZE)) {
            mushrooms.removeChild(mushroom);
            i--;
            if (zoom == 2.0)
                score += 15 * 2;
            else
                score += 15;

            mushroomCount--;
            svgdoc.getElementById("score").firstChild.data = score;
        }
    }

}


function startAgain() {
    // remove nodes in the previous game
    cleanUpGroup("monsters", false);
    cleanUpGroup("bullets", false);
    cleanUpGroup("highscoretext", false);
    cleanUpGroup("mushrooms", false);

    // hide the instruction screen
    svgdoc.getElementById("highscoretable").style.setProperty("visibility", "hidden", null);
    svgdoc.getElementById("startup_screen").style.setProperty("visibility", "visible", null);
    svgdoc.getElementById("normal_mode").style.setProperty("visibility", "visible", null);
    svgdoc.getElementById("zoom_mode").style.setProperty("visibility", "visible", null);

    score = 0;
    bulletCount = 8;
    mushroomCount = 8;
    timeRemain = 60;
    portalIn = false;
    opacityValue1 = 1.0;
    opacityValue2 = 1.0;
    opacityValue3 = 1.0;
    cheatMode = false;
    exiting = false;
    monsterBulletCount = 0;

    svgdoc.getElementById("score").firstChild.data = score;
    svgdoc.getElementById("bulletLeft").firstChild.data = 8;
    svgdoc.getElementById("score").firstChild.data = 0;
    svgdoc.getElementById("timeLeft").firstChild.data = timeRemain + "s";
    // Create the player
    player = new Player();
    player.node.setAttribute("style", "fill-opacity:1");

    startGame();
}

//
// This function updates the position of the bullets
//
function moveBullets() {
    // Go through all bullets
    var bullets = svgdoc.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);
        var x = parseInt(node.getAttribute("x"));
        if (node.data == motionType.LEFT) {
            node.setAttribute("x", x - BULLET_SPEED);
        } else {
            node.setAttribute("x", x + BULLET_SPEED);
        }

        if (x < 0 || x > SCREEN_SIZE.w) {
            if (node.getAttribute("id") == "monsterBullet")
                monsterBulletCount--;
            bullets.removeChild(node);
            i--;
        }

    }

}


//
// This function updates the position of the monsters
//
function moveMonsters() {
    var monsters = svgdoc.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var node = monsters.childNodes.item(i);
        node.setAttribute("isFlip", 0);
        var xValue = parseInt(node.getAttribute("x"));
        var yValue = parseInt(node.getAttribute("y"));
        var DxValue = parseInt(node.getAttribute("Dx"));
        var DyValue = parseInt(node.getAttribute("Dy"));
        if (xValue == DxValue && yValue == DyValue) {
            var movement = randomPoint();
            node.setAttribute("Dx", movement.x);
            node.setAttribute("Dy", movement.y);
            var check = movement.x - xValue < 0 ? 1 : 0;
            if (check != parseInt(node.getAttribute("isNegPos"))) {
                node.setAttribute("isFlip", 1);
                node.setAttribute("isNegPos", check);
            }
        } else if (xValue == DxValue && yValue != DyValue) {
            var moveY = 1;
            if (parseInt(node.getAttribute("y")) > DyValue)
                moveY *= -1;
            node.setAttribute("y", yValue + moveY);
        } else if (xValue != DxValue && yValue == DyValue) {
            var moveX = 1;
            if (parseInt(node.getAttribute("isNegPos"))) {
                moveX *= -1;
            }
            node.setAttribute("x", xValue + moveX);
        } else {
            var moveY = 1;
            if (yValue > parseInt(node.getAttribute("Dy")))
                moveY *= -1;
            node.setAttribute("y", yValue + moveY);
            var moveX = 1;
            if (parseInt(node.getAttribute("isNegPos"))) {
                moveX *= -1;
            }
            node.setAttribute("x", xValue + moveX);
        }
    }

}

//
// This function updates the position and motion of the player in the system
//
function gamePlay() {

    // Check collisions
    collisionDetection();

    // number of monster bullets on screen
    if (monsterBulletCount == 0) {
        shootMonsterBullet();
    }

    // Check whether the player is on a platform
    var isOnPlatform = player.isOnPlatform();

    // Check whether the player is on a portal
    var isOnPortalOne = player.isOnPortalOne();
    var isOnPortalTwo = player.isOnPortalTwo();


    // Update player position
    var displacement = new Point();

    // Move left or right
    if (player.motion == motionType.LEFT) {
        displacement.x = -MOVE_DISPLACEMENT;
    }

    if (player.motion == motionType.RIGHT)
        displacement.x = MOVE_DISPLACEMENT;

    // Fall
    if (!isOnPlatform && player.verticalSpeed <= 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        portalIn = false;
    }


    // Jump
    if (player.verticalSpeed > 0) {
        displacement.y = -player.verticalSpeed;

        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        if (player.verticalSpeed <= 0)
            player.verticalSpeed = 0;
    }

    // Get the new position of the player
    var position = new Point();
    position.x = player.position.x + displacement.x;
    position.y = player.position.y + displacement.y;

    // Check collision with platforms and screen
    player.collidePlatform(position);

    player.collideScreen(position);

    // Set the location back to the player object (before update the screen)
    player.position = position;
    if (isOnPortalOne == true && portalIn == false) {
        var position = new Point();
        position.x = 0;
        position.y = 20;
        player.position = position;
        portalIn = true;
    }

    if (isOnPortalTwo == true && portalIn == false) {
        var position = new Point();
        position.x = 20;
        position.y = 500;
        player.position = position;
        portalIn = true;
    }

    // Move the bullets
    moveBullets();

    // Move the monsters
    moveMonsters();
    backgmusic.play();

    // disappearing platform
    var disaP1 = svgdoc.getElementById("disappearing1");
    if (disaP1) {
        if (player.position.y + PLAYER_SIZE.h == parseInt(disaP1.getAttribute("y"))
            && (player.position.x + PLAYER_SIZE.w >= parseInt(disaP1.getAttribute("x")) && player.position.x <= parseInt(disaP1.getAttribute("width")) + parseInt(disaP1.getAttribute("x")))) {
            opacityValue1 -= 0.2;
            removePlatform(disaP1, opacityValue1);
        }
        if (opacityValue1 <= 0.0) {
            disaP1.parentNode.removeChild(disaP1);
        }
    }

    var disaP2 = svgdoc.getElementById("disappearing2");
    if (disaP2 != null) {
        if (player.position.y + PLAYER_SIZE.h == parseInt(disaP2.getAttribute("y"))
            && (player.position.x + PLAYER_SIZE.w >= parseInt(disaP2.getAttribute("x")) && player.position.x <= parseInt(disaP2.getAttribute("width")) + parseInt(disaP2.getAttribute("x")))
        ) {
            if (opacityValue2 > 0.0) {
                opacityValue2 -= 0.2;
                removePlatform(disaP2, opacityValue2);
            }
        }
        if (opacityValue2 <= 0.0) {
            disaP2.parentNode.removeChild(disaP2);
        }
    }

    var disaP3 = svgdoc.getElementById("disappearing3");
    if (disaP3 != null) {
        if (player.position.y + PLAYER_SIZE.h == parseInt(disaP3.getAttribute("y"))
            && (player.position.x + PLAYER_SIZE.w >= parseInt(disaP3.getAttribute("x")) && player.position.x <= parseInt(disaP3.getAttribute("width")) + parseInt(disaP3.getAttribute("x")))
        ) {
            if (opacityValue3 > 0.0) {
                opacityValue3 -= 0.2;
                removePlatform(disaP3, opacityValue3);
            }
        }
        if (opacityValue3 <= 0.0) {
            disaP3.parentNode.removeChild(disaP3);
        }
    }

    updateScreen();
}



//
// This function updates the position of the player's SVG object and
// set the appropriate translation of the game screen relative to the
// the position of the player
//
function updateScreen() {

    // Transform the player
    if (player.motion == motionType.LEFT || motionKeep == motionType.LEFT)
        player.node.setAttribute("transform", "translate(" + (player.position.x + PLAYER_SIZE.w) + "," + player.position.y + ") scale(-1, 1)");
    else
        player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");

    // Calculate the scaling and translation factors	
    var scale = new Point(zoom, zoom);
    var translate = new Point();

    translate.x = SCREEN_SIZE.w / 2.0 - (player.position.x + PLAYER_SIZE.w / 2) * scale.x;
    if (translate.x > 0)
        translate.x = 0;
    else if (translate.x < SCREEN_SIZE.w - SCREEN_SIZE.w * scale.x)
        translate.x = SCREEN_SIZE.w - SCREEN_SIZE.w * scale.x;

    translate.y = SCREEN_SIZE.h / 2.0 - (player.position.y + PLAYER_SIZE.h / 2) * scale.y;
    if (translate.y > 0)
        translate.y = 0;
    else if (translate.y < SCREEN_SIZE.h - SCREEN_SIZE.h * scale.y)
        translate.y = SCREEN_SIZE.h - SCREEN_SIZE.h * scale.y;


    // flipping, refer to https://github.com/wateryheart
    var monsters = svgdoc.getElementById("monsters");
    for (var i = 0; i < svgdoc.getElementById("monsters").childNodes.length; i++) {
        var node = monsters.childNodes.item(i);
        if (node.getAttribute("isFlip")) {
            if (parseInt(node.getAttribute("isNegPos"))) {
                var xPos = parseInt(node.getAttribute("x"));
                node.setAttribute("transform", "translate(" + (2 * xPos + MONSTER_SIZE.w) + ",0 ) scale(-1, 1)");
            }
            else
                node.setAttribute("transform", "");
            node.setAttribute("isFlip", false);
        }
    }

    // transform the player name on top of the player
    svgdoc.getElementById("playerName").setAttribute("transform", "translate(" + (player.position.x - svgdoc.getElementById("playerName").getComputedTextLength() / 2 + 20) + "," + (player.position.y - 3) + ")");

    // Transform the game area
    svgdoc.getElementById("gamearea").setAttribute("transform", "translate(" + translate.x + "," + translate.y + ") scale(" + scale.x + "," + scale.y + ")");
}


//
// This function sets the zoom level
//
function setMode(mode) {
    if (mode == 1)
        zoom = 2.0;
    else if (mode == 0)
        zoom = 1.0;

    // hide the starting instruction screen
    svgdoc.getElementById("startup_screen").style.setProperty("visibility", "hidden", null);
    svgdoc.getElementById("normal_mode").style.setProperty("visibility", "hidden", null);
    svgdoc.getElementById("zoom_mode").style.setProperty("visibility", "hidden", null);

    // ask for player name
    if (playerName == null) {
        playerName = prompt("What is your name?", "");
    } else {
        playerName = prompt("What is your name?", playerName);
    }

    // default name
    if (playerName == "") {
        playerName = "Anonymous";
    }

    svgdoc.getElementById("playerName").firstChild.data = playerName;
    svgdoc.getElementById("playerName").setAttribute("transform", "translate(" + (player.position.x - svgdoc.getElementById("playerName").getComputedTextLength() / 2 + 20) + "," + (player.position.y - 3) + ")");

    gameTimeout = setInterval("timeCount()", 1000);

    // Start the game interval
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
}




//
// A score record JavaScript class to store the name and the score of a player
//
function ScoreRecord(name, score) {
    this.name = name;
    this.score = score;
}


//
// This function reads the high score table from the cookies
//
function getHighScoreTable() {
    var table = new Array();

    for (var i = 0; i < 10; i++) {
        // Contruct the cookie name
        var name = "player" + i;

        // Get the cookie value using the cookie name
        var value = getCookie(name);

        // If the cookie does not exist exit from the for loop
        if (value == null) break;

        // Extract the name and score of the player from the cookie value
        var record = value.split("~");

        // Add a new score record at the end of the array
        var sr_record = new ScoreRecord(record[0], parseInt(record[1]));
        table.push(sr_record);

    }

    return table;
}


//
// This function stores the high score table to the cookies
//
function setHighScoreTable(table) {
    for (var i = 0; i < 10; i++) {
        // If i is more than the length of the high score table exit
        // from the for loop
        if (i >= table.length) break;

        // Contruct the cookie name
        var name = "player" + i;

        // Store the ith record as a cookie using the cookie name
        setCookie(name, table[i].name + "~" + table[i].score);

    }
}


//
// This function adds a high score entry to the text node
//
function addHighScore(record, node) {
    // Create the name text span
    var name = svgdoc.createElementNS("http://www.w3.org/2000/svg", "tspan");

    // Set the attributes and create the text

    name.setAttribute("x", 100);
    name.setAttribute("dy", 40);
    name.appendChild(svgdoc.createTextNode(record.name));
    if (record.name == playerName) {
        name.setAttribute("style", "fill:red");
    } else if (record.name != playerName) {
        name.setAttribute("style", "fill:black");
    }
    // Add the name to the text node
    node.appendChild(name);

    // Create the score text span
    var score = svgdoc.createElementNS("http://www.w3.org/2000/svg", "tspan");

    // Set the attributes and create the text
    score.setAttribute("x", 400);
    score.appendChild(svgdoc.createTextNode(record.score));

    // Add the name to the text node
    node.appendChild(score);

}


//
// This function shows the high score table to SVG 
//
function showHighScoreTable(table) {
    // Show the table
    var node = svgdoc.getElementById("highscoretable");
    node.style.setProperty("visibility", "visible", null);

    // Get the high score text node
    var node = svgdoc.getElementById("highscoretext");

    for (var i = 0; i < 10; i++) {
        // If i is more than the length of the high score table exit
        // from the for loop
        if (i >= table.length) break;

        // Add the record at the end of the text node
        addHighScore(table[i], node);
    }
}


//
// The following functions are used to handle HTML cookies
//

//
// Set a cookie
//
function setCookie(name, value, expires, path, domain, secure) {
    var curCookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
    document.cookie = curCookie;
}


//
// Get a cookie
//
function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else
        begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1)
        end = dc.length;
    return unescape(dc.substring(begin + prefix.length, end));
}


//
// Delete a cookie
//
function deleteCookie(name, path, domain) {
    if (get_cookie(name)) {
        document.cookie = name + "=" +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}
