var background, list, body;
var z = 0;

function init()
{
    root = document.querySelector(":root");
    body = document.querySelector("body");
    main = document.querySelector("main");
    background = document.querySelector("main > .background"); 
    list = document.querySelectorAll(".card");

    background.addEventListener("click", close);
    document.querySelector("body > .background:first-child").addEventListener("click", close);

    list.forEach(item => 
    {
        item.addEventListener("click", open)
    })
}

function open(event)
{
    event.preventDefault;

    background.style.display = "table";
    background.style.setProperty("z-index", ++z);

    this.classList.remove("card")
    this.classList.add("opencard")
    this.addEventListener("click", close);
    this.style.setProperty("z-index", ++z);

    let current = this.querySelector(".flipper");
    current.classList.remove("close");
    current.classList.add("open");
    current.classList.add("rotate");

    console.log()
    root.style.setProperty('--tox', main.offsetWidth / 2 - this.offsetLeft + "px");
    root.style.setProperty('--toy', main.offsetHeight / 2 - this.offsetTop + "px");
}

function close(event)
{
    event.preventDefault;

    let selected = document.querySelector(".opencard");
    if (selected)
    {
        if (event.target.tagName == 'IMG')
        {
            flip(event);
            return;
        }

        selected.classList.remove("opencard");
        selected.classList.add("card");
        selected.removeEventListener("click", close);

        let current = document.querySelector(".open");
        current.classList.remove("flip");
        root.style.setProperty('--fromr', 0 + "deg");
        root.style.setProperty('--tor', 180 + "deg");
        current.classList.remove("open");
        current.classList.add("close");

        background.style.display = "none";
    }
}

function flip(event)
{
    let current = document.querySelector(".open");
    current.classList.remove("flip");
    void current.offsetWidth;
    current.classList.add("flip");

    let from = getComputedStyle(root).getPropertyValue('--fromr');
    let to = getComputedStyle(root).getPropertyValue('--tor');

    root.style.setProperty("--fromr", to);
    root.style.setProperty("--tor", from);
}