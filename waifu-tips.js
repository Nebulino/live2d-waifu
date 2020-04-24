/*
 * Live2D
 */

function loadWidget(config) {
    let {waifuPath, apiPath, cdnPath} = config;
    let useCDN = false, modelList;
    if (typeof cdnPath === "string") {
        useCDN = true;
        if (!cdnPath.endsWith("/")) cdnPath += "/";
    }
    if (!apiPath.endsWith("/")) apiPath += "/";
    localStorage.removeItem("waifu-display");
    sessionStorage.removeItem("waifu-text");
    document.body.insertAdjacentHTML("beforeend", `<div id="waifu">
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="800" height="800"></canvas>
			<div id="waifu-tool">
				<span class="fa fa-lg fa-comment"></span>
				<span class="fa fa-lg fa-paper-plane"></span>
				<span class="fa fa-lg fa-user-circle"></span>
				<span class="fa fa-lg fa-street-view"></span>
				<span class="fa fa-lg fa-camera-retro"></span>
				<span class="fa fa-lg fa-info-circle"></span>
				<span class="fa fa-lg fa-times"></span>
			</div>
		</div>`);

    setTimeout(() => {
        document.getElementById("waifu").style.bottom = 0;
    }, 0);

    function randomSelection(obj) {
        return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
    }

    let userAction = false,
        userActionTimer,
        messageTimer,
        messageArray = ["Long time no see, life is going fast...",
            "Damn! How long have you been ignoring others, bang bang bang ~",
            "Hey~ Come and tease me!", "Take a small punch and hammer your chest!",
            "Remember to add me to the Adblock whitelist!"];

    window.addEventListener("mousemove", () => userAction = true);
    window.addEventListener("keydown", () => userAction = true);
    setInterval(() => {
        if (userAction) {
            userAction = false;
            clearInterval(userActionTimer);
            userActionTimer = null;
        } else if (!userActionTimer) {
            userActionTimer = setInterval(() => {
                showMessage(randomSelection(messageArray), 6000, 9);
            }, 20000);
        }
    }, 1000);

    (function registerEventListener() {
        document.querySelector("#waifu-tool .fa-comment").addEventListener("click", showHitokoto);
        document.querySelector("#waifu-tool .fa-paper-plane").addEventListener("click", () => {
            if (window.Asteroids) {
                if (!window.ASTEROIDSPLAYERS) window.ASTEROIDSPLAYERS = [];
                window.ASTEROIDSPLAYERS.push(new Asteroids());
            } else {
                let script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/gh/Nebulino/CuteDispenserNetwork/app/asteroids.js";
                document.head.appendChild(script);
            }
        });
        document.querySelector("#waifu-tool .fa-user-circle").addEventListener("click", loadOtherModel);
        document.querySelector("#waifu-tool .fa-street-view").addEventListener("click", loadRandModel);
        document.querySelector("#waifu-tool .fa-camera-retro").addEventListener("click", () => {
            showMessage("We took a photo, is it cute?", 6000, 9);
            Live2D.captureName = "photo.png";
            Live2D.captureFrame = true;
        });
        document.querySelector("#waifu-tool .fa-info-circle").addEventListener("click", () => {
            open("https://github.com/Nebulino/live2d-waifu");
        });
        document.querySelector("#waifu-tool .fa-times").addEventListener("click", () => {
            localStorage.setItem("waifu-display", Date.now());
            showMessage("You may reunite with important people one day.", 2000, 11);
            document.getElementById("waifu").style.bottom = "-500px";
            setTimeout(() => {
                document.getElementById("waifu").style.display = "none";
                document.getElementById("waifu-toggle").classList.add("waifu-toggle-active");
            }, 3000);
        });
        let devtools = () => {
        };
        console.log("%c", devtools);
        devtools.toString = () => {
            showMessage("Ah, you opened the console, do you want to see my little secret?", 6000, 9);
        };
        window.addEventListener("copy", () => {
            showMessage("What have you copied, please remember to add the source!", 6000, 9);
        });
        window.addEventListener("visibilitychange", () => {
            if (!document.hidden) showMessage("Wow, you are finally back ~", 6000, 9);
        });
    })();

    (function welcomeMessage() {
        let text;
        if (location.pathname === "/") {
            let now = new Date().getHours();
            if (now > 5 && now <= 7) text = "Good morning! The day's plan is in the morning, " +
				"and a good day is about to begin.";
            else if (now > 7 && now <= 11) text = "Good morning! Work well, don't sit for long, " +
				"get up and move around!";
            else if (now > 11 && now <= 13) text = "It's noon, " +
				"I have been working all morning, and it's lunch time!";
            else if (now > 13 && now <= 17) text = "It's easy to fall asleep in the afternoon. " +
				"Have you achieved your goals today?";
            else if (now > 17 && now <= 19) text = "It's evening! " +
				"The sunset outside the window is very beautiful, but the most beautiful is the red sunset~";
            else if (now > 19 && now <= 21) text = "Good evening, is today went well?";
            else if (now > 21 && now <= 23) text = ["It's already so late, rest early, good night ~",
				"Take care of your eyes late at night!"];
            else text = "Are you a night owl? You're not sleeping, can you get up tomorrow?";
        } else if (document.referrer !== "") {
            let referrer = new URL(document.referrer),
                domain = referrer.hostname.split(".")[1];
            if (location.hostname === referrer.hostname) text = `Welcome to read<span>「${document.title.split(" - ")[0]}」</span>`;
            else if (domain === "baidu") text = `Hello! Friend from Baidu search<br>You are searching <span>${referrer.search.split("&wd=")[1].split("&")[0]}</span> Did you find me?`;
            else if (domain === "so") text = `Hello! Friends from 360 search<br>You are searching <span>${referrer.search.split("&q=")[1].split("&")[0]}</span> Did you find me?`;
            else if (domain === "google") text = `Hello! Friends from Google search<br>Welcome to read<span>「${document.title.split(" - ")[0]}」</span>`;
            else text = `Hello! From <span>${referrer.hostname}</span>, my friend!`;
        } else {
            text = `Welcome to read<span>「${document.title.split(" - ")[0]}」</span>`;
        }
        showMessage(text, 7000, 8);
    })();

    function showHitokoto() {

        fetch("https://v1.hitokoto.cn")
            .then(response => response.json())
            .then(result => {
                let text = `This phrase comes from<span>「${result.from}」</span>, Yep... <span>${result.creator}</span> at hitokoto.`;
                showMessage(result.hitokoto, 6000, 9);
                setTimeout(() => {
                    showMessage(text, 4000, 9);
                }, 6000);
            });
    }

    function showMessage(text, timeout, priority) {
        if (!text || (sessionStorage.getItem("waifu-text") && sessionStorage.getItem("waifu-text") > priority)) return;
        if (messageTimer) {
            clearTimeout(messageTimer);
            messageTimer = null;
        }
        text = randomSelection(text);
        sessionStorage.setItem("waifu-text", priority);
        let tips = document.getElementById("waifu-tips");
        tips.innerHTML = text;
        tips.classList.add("waifu-tips-active");
        messageTimer = setTimeout(() => {
            sessionStorage.removeItem("waifu-text");
            tips.classList.remove("waifu-tips-active");
        }, timeout);
    }

    (function initModel() {
        let modelId = localStorage.getItem("modelId"),
            modelTexturesId = localStorage.getItem("modelTexturesId");
        if (modelId === null) {
            modelId = 1;
            modelTexturesId = 53;
        }
        loadModel(modelId, modelTexturesId);
        fetch(waifuPath)
            .then(response => response.json())
            .then(result => {
                window.addEventListener("mouseover", event => {
                    for (let tips of result.mouseover) {
                        if (!event.target.matches(tips.selector)) continue;
                        let text = randomSelection(tips.text);
                        text = text.replace("{text}", event.target.innerText);
                        showMessage(text, 4000, 8);
                        return;
                    }
                });
                window.addEventListener("click", event => {
                    for (let tips of result.click) {
                        if (!event.target.matches(tips.selector)) continue;
                        let text = randomSelection(tips.text);
                        text = text.replace("{text}", event.target.innerText);
                        showMessage(text, 4000, 8);
                        return;
                    }
                });
                result.seasons.forEach(tips => {
                    let now = new Date(),
                        after = tips.date.split("-")[0],
                        before = tips.date.split("-")[1] || after;
                    if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
                        let text = randomSelection(tips.text);
                        text = text.replace("{year}", now.getFullYear());
                        //showMessage(text, 7000, true);
                        messageArray.push(text);
                    }
                });
            });
    })();

    async function loadModelList() {
        let response = await fetch(`${cdnPath}model_list.json`);
        let result = await response.json();
        modelList = result;
    }

    async function loadModel(modelId, modelTexturesId, message) {
        localStorage.setItem("modelId", modelId);
        localStorage.setItem("modelTexturesId", modelTexturesId);
        showMessage(message, 4000, 10);
        if (useCDN) {
            if (!modelList) await loadModelList();
            let target = randomSelection(modelList.models[modelId]);
            loadlive2d("live2d", `${cdnPath}model/${target}/index.json`);
        } else {
            loadlive2d("live2d", `${apiPath}get/?id=${modelId}-${modelTexturesId}`);
            console.log(`Live2D model ${modelId}-${modelTexturesId} | Loading completed`);
        }
    }

    async function loadRandModel() {
        let modelId = localStorage.getItem("modelId"),
            modelTexturesId = localStorage.getItem("modelTexturesId");
        if (useCDN) {
            if (!modelList) await loadModelList();
            let target = randomSelection(modelList.models[modelId]);
            loadlive2d("live2d", `${cdnPath}model/${target}/index.json`);
            showMessage("Is my new clothes beautiful?", 4000, 10);
        } else {
            fetch(`${apiPath}rand_textures/?id=${modelId}-${modelTexturesId}`)
                .then(response => response.json())
                .then(result => {
                    if (result.textures.id === 1 && (modelTexturesId === 1 || modelTexturesId === 0)) showMessage("I don't have any other clothes yet!", 4000, 10);
                    else loadModel(modelId, result.textures.id, "Is my new clothes beautiful?");
                });
        }
    }

    async function loadOtherModel() {
        let modelId = localStorage.getItem("modelId");
        if (useCDN) {
            if (!modelList) await loadModelList();
            let index = (++modelId >= modelList.models.length) ? 0 : modelId;
            loadModel(index, 0, modelList.messages[index]);
        } else {
            fetch(`${apiPath}switch/?id=${modelId}`)
                .then(response => response.json())
                .then(result => {
                    loadModel(result.model.id, 0, result.model.message);
                });
        }
    }
}

function initWidget(config, apiPath = "/") {
    if (typeof config === "string") {
        config = {
            waifuPath: config,
            apiPath
        };
    }
    document.body.insertAdjacentHTML("beforeend", `<div id="waifu-toggle">
			<span>Signboard girl</span>
		</div>`);
    let toggle = document.getElementById("waifu-toggle");
    toggle.addEventListener("click", () => {
        toggle.classList.remove("waifu-toggle-active");
        if (toggle.getAttribute("first-time")) {
            loadWidget(config);
            toggle.removeAttribute("first-time");
        } else {
            localStorage.removeItem("waifu-display");
            document.getElementById("waifu").style.display = "";
            setTimeout(() => {
                document.getElementById("waifu").style.bottom = 0;
            }, 0);
        }
    });
    if (localStorage.getItem("waifu-display") && Date.now() - localStorage.getItem("waifu-display") <= 86400000) {
        toggle.setAttribute("first-time", true);
        setTimeout(() => {
            toggle.classList.add("waifu-toggle-active");
        }, 0);
    } else {
        loadWidget(config);
    }
}
