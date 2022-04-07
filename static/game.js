var click = new Audio("static/buttonclick.mp3");
var hover = new Audio("static/buttonhover.mp3");
var gameHappening = false;

window.onload = function() {
    buttonSounds();
}

var changeScreen = function() {
    // Remove start screen
    var title = document.getElementById("title");
    var start = document.getElementById("start");

    title.classList.add("disappear");
    start.classList.add("disappear");
    setTimeout(() => {
        runGame()
    }, 1000);
}

var runGame = async function() {
    title.style.display = "none";
    start.style.display = "none";

    // Show game screen
    var gameElems = document.getElementsByClassName("game-screen");
    for (var i = 0; i < gameElems.length; i++)
    {
        appear(gameElems[i]);
    }

    // Start playing rounds!
    var level = 1;
    var maxlevel = 1;
    var lives = 3;
    var win = true;
    var simons = document.getElementsByClassName("simon");
    while (lives > 0)
    {
        // Remove button sounds
        gameHappening = true;

        await sleep(3000);

        // Change game messages
        document.getElementById("game-message").innerHTML = "Watch closely...";
        document.getElementById("level").innerHTML = "Level: " + level;
        document.getElementById("maxlevel").innerHTML = "Max Level: " + maxlevel;
        document.getElementById("lives").innerHTML = "Lives: " + lives;

        var win = await newRound(level, simons);
        if (win)
        {
            document.getElementById("game-message").innerHTML = "Correct!";
            level++;
            
            // Replace maxlevel if level is larger
            if (level > maxlevel)
            {
                maxlevel = level;
            }
        }
        else
        {
            document.getElementById("game-message").innerHTML = "Wrong...";
            lives--;
            
            // If you lose, go down a level
            if (level > 1)
            {
                level--;
            }
        }
    }

    window.location += "results/" + maxlevel;
}

var newRound = async function(level, simons) {
    // Illuminate random simons
    // From user Simon Borsky on https://stackoverflow.com/questions/5836833/create-an-array-with-random-values
    var toIlluminate = Array.from({length: level}, () => Math.floor(Math.random() * 4));
    var order = ["green", "yellow", "red", "blue"]

    for (var i = 0; i < toIlluminate.length; i++)
    {
        simon = simons[toIlluminate[i]];
        simon.classList.add("illuminate");
        await sleep(1000);
        simon.classList.remove("illuminate");
        void simon.offsetWidth; // Trigger DOM reflow, debug courtsey of https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/
    }

    // Reset button sounds
    gameHappening = false;

    // Get user input
    document.getElementById("game-message").innerHTML = "Enter the sequence as you remember it..."
    var right = true;
    var userInput = [];

    for (var i = 0; i < simons.length; i++)
    {
        simons[i].classList.add("ready");
        simons[i].addEventListener("click", function(e) {
            var clicked = order.indexOf(e.target.id);
            userInput.push(clicked);

            // If user input correct
            if (clicked == toIlluminate[0])
            {
                toIlluminate.shift();
            }
            // If user input wrong
            else
            {
                right = false;
            }
        });
    }

    while (userInput.length < level && right)
    {
        await sleep(100);
    }

    // Make buttons unclickable
    for (var i = 0; i < simons.length; i++)
    {
        simons[i].classList.remove("ready");
    }

    return right;
}

var buttonSounds = function() {
    // Add button sounds
    var buttons = document.getElementsByTagName("button");

    for (var i = 0; i < buttons.length; i++)
    {
        buttons[i].addEventListener("click", function() {
            if (!gameHappening)
            {
                click.play();
            }
        });
        buttons[i].addEventListener("mouseover", function() {
            if (!gameHappening)
            {
                hover.play();
            }
        });
    }
}

var appear = async function(elem) {
    elem.classList.add("appear");
    elem.style.display = "inline-block";
    elem.style.opacity = 1;
    await sleep(1000);
    elem.classList.remove("appear");
}

// Sleep function from https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
