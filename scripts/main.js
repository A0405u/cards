var background, list, body;
var z = 0;
var scale = 2;
var r = 180;
var d = 1;
var speed = 16;
var down = false;
var interval = null;
var repeat = null;
var closing = false;
var switching = false;
var previousX = 0;
var fps = 12;
var ms = 1000 / fps;

function init()
{
    root = document.querySelector(":root");
    body = document.querySelector("body");
    main = document.querySelector("main");
    background = document.querySelector(".background"); 
    opencard = document.querySelector(".opencard");
    leftcard = document.querySelector(".leftcard");
    rightcard = document.querySelector(".rightcard");
    supportcard = document.querySelector(".supportcard");
    openflipper = opencard.querySelector(".flipper");
    list = document.querySelectorAll(".card");
    pressed = null;
    current = null;

    background.addEventListener("click", close);
    document.addEventListener("mousedown", mousedown);
    document.addEventListener("touchstart", touchstart);
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("touchmove", touchmove);
    document.addEventListener("mouseup", mouseup);
    document.addEventListener("touchend", mouseup);

    list.forEach(item => 
    {
        item.addEventListener("click", open);
        item.addEventListener("mousedown", press);
    })

    leftcard.addEventListener("click", slideLeft, {once: true});
    rightcard.addEventListener("click", slideRight, {once: true});
}

function press(event)
{
    event.preventDefault();
    this.classList.add("pressed");
    pressed = this;
}

function open(event)
{
    event.preventDefault();

    speed = 16;
    r = 180;
    root.style.setProperty("--r", r + "deg");

    background.style.display = "block";
    background.classList.add("show");
    opencard.style.display = "block";
    this.classList.add("selected")
    current = this;

    body.style.setProperty("overflow", "hidden");

    opencard.querySelector(".front").src = this.querySelector(".front").src;
    opencard.querySelector(".back").src = this.querySelector(".back").src;
    opencard.querySelector(".name").innerHTML = this.querySelector(".name").innerHTML;
    setLinks(opencard, this);

    root.style.setProperty("--fromx", this.offsetLeft - document.documentElement.scrollLeft + this.offsetWidth / 2 + "px");
    root.style.setProperty("--fromy", this.offsetTop - document.documentElement.scrollTop + this.offsetHeight / 2 + "px");
    root.style.setProperty("--tox", background.offsetWidth / 2 + "px");
    root.style.setProperty("--toy", background.offsetHeight / 2 + "px");

    opencard.classList.add("open");
    opencard.addEventListener("animationend", function() 
    {
        opencard.classList.remove("open");
        opencard.classList.add("opened");
    })

    if (this.previousElementSibling)
    {
        leftcard.style.display = "block";
        leftcard.classList.add("open");

        leftcard.querySelector(".front").src = this.previousElementSibling.querySelector(".front").src;
        leftcard.querySelector(".back").src = this.previousElementSibling.querySelector(".back").src;
    
        root.style.setProperty("--lfromx", -leftcard.offsetWidth + "px");
        root.style.setProperty("--lfromy", background.offsetHeight / 2 + "px");
        root.style.setProperty("--ltox", 0 + "px");
        root.style.setProperty("--ltoy", background.offsetHeight / 2 + "px");

        leftcard.addEventListener("animationend", function()
        {
            leftcard.classList.remove("open");
            leftcard.classList.add("opened");
        })
    }

    if (this.nextElementSibling)
    {
        rightcard.style.display = "block";
        rightcard.classList.add("open");
    
        rightcard.querySelector(".front").src = this.nextElementSibling.querySelector(".front").src;
        rightcard.querySelector(".back").src = this.nextElementSibling.querySelector(".back").src;

        root.style.setProperty("--rfromx", background.offsetWidth + rightcard.offsetWidth + "px");
        root.style.setProperty("--rfromy", background.offsetHeight / 2 + "px");
        root.style.setProperty("--rtox", background.offsetWidth + "px");
        root.style.setProperty("--rtoy", background.offsetHeight / 2 + "px");

        rightcard.addEventListener("animationend", function()
        {
            rightcard.classList.remove("open");
            rightcard.classList.add("opened");
        })
    }

    interval = setInterval(spin, ms);
    
}

function close(event)
{
    if (event)
        event.preventDefault();

    if (switching == true)
    {
        closing = true;
        return;
    }

    closing = false;

    body.style.setProperty("overflow", "auto");
    root.style.setProperty("--tor", r - (r % 360) + "deg");
    root.style.setProperty("--fromx", current.offsetLeft - document.documentElement.scrollLeft + current.offsetWidth / 2 + "px");
    root.style.setProperty("--fromy", current.offsetTop - document.documentElement.scrollTop + current.offsetHeight / 2 + "px");

    opencard.classList.remove("open");
    opencard.classList.remove("opened");
    opencard.classList.add("close");
    opencard.addEventListener('animationend', hide);

    background.classList.remove("show");
    background.classList.add("hide");

    if (leftcard.classList.contains("opened"))
    {
        leftcard.classList.remove("opened");
        leftcard.classList.add("close");
    }

    if (rightcard.classList.contains("opened"))
    {
        rightcard.classList.remove("opened");
        rightcard.classList.add("close");
    }

    clearInterval(interval);
}

function hide(event)
{
    opencard.removeEventListener('animationend', hide);
    opencard.classList.remove("close");

    background.style.display = "none";
    background.classList.remove("hide");
    opencard.style.display = "none";
    current.classList.remove("selected");
    current = null;

    if (leftcard.classList.contains("close"))
    {
        leftcard.style.display = "none";
        leftcard.classList.remove("close");
    }

    if (rightcard.classList.contains("close"))
    {
        rightcard.style.display = "none";
        rightcard.classList.remove("close");
    }
}

function mousedown(event)
{
    event.preventDefault();
    speed = 0;
    down = true;
}

function touchstart(event)
{
    event.preventDefault();
    speed = 0;
    down = true;

    previousX = event.touches[0].clientX;
}

function mousemove(event)
{
    if (down == true)
    {
        speed = event.movementX * 20;

        if (speed > 0)
            d = 1;
            
        if (speed < 0)
            d = -1;
    }
}

function touchmove(event)
{
    if (down == true)
    {
        speed = (event.touches[0].clientX - previousX) * 20;
        previousX = event.touches[0].clientX;

        if (speed > 0)
            d = 1;
            
        if (speed < 0)
            d = -1;
    }
}

function mouseup(event)
{
    down = false;
    
    if (pressed)
    {
        pressed.classList.remove("pressed");
        pressed = null;
    }
}

function spin()
{
    r += speed / fps ;
    root.style.setProperty("--r", r + "deg");

    speed /= 1.4;

    if (down == false)
    {
        if (speed > -36 && speed < 36)
            speed = 16 * d;
    }
}

function slideRight()
{
    switching = true;
    slide = null;

    current.classList.remove("selected");
    current = current.nextElementSibling; // CHANGE
    current.classList.add("selected");

    if (leftcard.classList.contains("opened")) // CHANGE
    {
        leftcard.classList.remove("opened"); // CHANGE
        leftcard.classList.add("close"); // CHANGE
        leftcard.addEventListener('animationend', function() // CHANGE
        {
            // leftcard.style.display = "none"; // CHANGE
            leftcard.classList.remove("close"); // CHANGE
        }, {once: true});
    }

    root.style.setProperty("--tor", r - (r % 360) + "deg");
    clearInterval(interval);

    opencard.classList.add("slidel"); // CHANGE

    if (current.nextElementSibling) // CHANGE
    {
        supportcard.style.display = "block";
        supportcard.classList.add("rightcard"); // CHANGE
        supportcard.classList.add("open");

        supportcard.querySelector(".front").src = current.nextElementSibling.querySelector(".front").src; // CHANGE
        supportcard.querySelector(".back").src = current.nextElementSibling.querySelector(".back").src; // CHANGE

        root.style.setProperty("--lfromx", -leftcard.offsetWidth + "px"); // CHANGE CHANGE
        root.style.setProperty("--lfromy", background.offsetHeight / 2 + "px"); // CHANGE
        root.style.setProperty("--ltox", 0 + "px"); // CHANGE
        root.style.setProperty("--ltoy", background.offsetHeight / 2 + "px"); // CHANGE
    }

    rightcard.classList.add("slide"); // CHANGE
    rightcard.querySelector(".name").innerHTML = current.querySelector(".name").innerHTML; // CHANGE
    setLinks(rightcard, current);

    // rightcard.querySelector(".flipper").addEventListener('transitionend', switchRight, {once : true}); // CHANGE CHANGE
    rightcard.addEventListener('animationend', switchRight, {once : true});
}

function switchRight()
{
    let temp = supportcard;
    
    supportcard = leftcard; 
    supportcard.removeEventListener("click", slideLeft);
    supportcard.classList.remove(...supportcard.classList);
    supportcard.classList.add("supportcard");
    supportcard.style.display = "none";

    leftcard = opencard;
    leftcard.classList.remove(...leftcard.classList);
    leftcard.classList.add("leftcard", "opened");

    leftcard.addEventListener("click", slideLeft);

    opencard = rightcard;
    opencard.removeEventListener("click", slideRight);
    opencard.classList.remove(...opencard.classList);
    opencard.classList.add("opencard", "opened");

    rightcard = temp;
    rightcard.classList.remove(...rightcard.classList);
    rightcard.classList.add("rightcard", "opened");
    rightcard.addEventListener("click", slideRight);

    if (current.nextElementSibling == null)
        rightcard.style.display = "none";

    speed = 16;
    r = 180;
    d = 1;
    root.style.setProperty("--r", r + "deg");
    interval = setInterval(spin, ms);

    switching = false;

    if (closing)
        close();
}

function slideLeft()
{
    switching = true;
    slide = null;

    current.classList.remove("selected");
    current = current.previousElementSibling;
    current.classList.add("selected");

    if (rightcard.classList.contains("opened"))
    {
        rightcard.classList.remove("opened");
        rightcard.classList.add("close");
        rightcard.addEventListener('animationend', function()
        {
            // rightcard.style.display = "none";
            rightcard.classList.remove("close");
        }, {once: true});
    }

    root.style.setProperty("--tor", r - (r % 360) + "deg");
    clearInterval(interval);

    opencard.classList.add("slider");

    if (current.previousElementSibling)
    {
        supportcard.style.display = "block";
        supportcard.classList.add("leftcard");
        supportcard.classList.add("open");

        supportcard.querySelector(".front").src = current.previousElementSibling.querySelector(".front").src;
        supportcard.querySelector(".back").src = current.previousElementSibling.querySelector(".back").src;

        root.style.setProperty("--rfromx", background.offsetWidth + rightcard.offsetWidth + "px");
        root.style.setProperty("--rfromy", background.offsetHeight / 2 + "px");
        root.style.setProperty("--rtox", background.offsetWidth + "px");
        root.style.setProperty("--rtoy", background.offsetHeight / 2 + "px");
    }

    leftcard.classList.add("slide");
    leftcard.querySelector(".name").innerHTML = current.querySelector(".name").innerHTML;
    setLinks(leftcard, current);

    // leftcard.querySelector(".flipper").addEventListener('transitionend', switchLeft, {once : true});
    leftcard.addEventListener('animationend', switchLeft, {once : true});
}

function switchLeft()
{
    let temp = supportcard;
    
    supportcard = rightcard;
    supportcard.removeEventListener("click", slideRight);
    supportcard.classList.remove(...supportcard.classList);
    supportcard.classList.add("supportcard");
    supportcard.style.display = "none";

    rightcard = opencard;
    rightcard.classList.remove(...rightcard.classList);
    rightcard.classList.add("rightcard", "opened");

    rightcard.addEventListener("click", slideRight);

    opencard = leftcard;
    opencard.removeEventListener("click", slideLeft);
    opencard.classList.remove(...opencard.classList);
    opencard.classList.add("opencard", "opened");

    leftcard = temp;
    leftcard.classList.remove(...leftcard.classList);
    leftcard.classList.add("leftcard", "opened");
    leftcard.addEventListener("click", slideLeft);

    if (current.previousElementSibling == null)
        leftcard.style.display = "none";

    speed = 16;
    r = 180;
    d = 1;
    root.style.setProperty("--r", r + "deg");
    interval = setInterval(spin, ms);

    switching = false;

    if (closing)
        close();
}

function setLinks(card, source)
{
    let twitter = source.querySelector(".link.twitter");
    let vk = source.querySelector(".link.vk");

    if (twitter)
    {
        card.querySelector(".link.twitter").style.display = "inline-block";
        card.querySelector(".link.twitter").href = twitter.href;
    }
    else
        card.querySelector(".link.twitter").style.display = "none";

    if (vk)
    {
        card.querySelector(".link.vk").style.display = "inline-block";
        card.querySelector(".link.vk").href = vk.href;
    }
    else
        card.querySelector(".link.vk").style.display = "none";
}