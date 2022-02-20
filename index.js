function ajax(obj) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            if(xhr.status == 200) {
                obj.success(JSON.parse(xhr.responseText));
            }else {
                obj.error(xhr.responseText);
            }
        }
    }
    xhr.open("get", obj.url);
    xhr.send();
}

function createElement(data) {
    return `
    <section class="img" ${data.animasi ? `style="animation: fadeIn 1s ease-in forwards"` : ``}>
        <img src="bahan/${data.image}" alt="scene1">
    </section>
    <section class="col-teks">
        <div class="chara">
            <h3>${data.chara}</h3>
        </div>
        <p class="teks"></p>
    </section>
    <section class="btn-next" style="animation: fadeIn 1s ease-in forwards">
        <button data-id="${data.scene}">&gt&gt</button>
    </section>
    `
}

function createElement2(data) {
    return `
    <section class="img" ${data.animasi ? `style="animation: fadeIn 1s ease-in forwards"` : ``}>
            <img src="bahan/${data.image}" alt="scene1">
        </section>
        <section class="col-teks">
            <div class="chara">
                <h3>${data.chara}</h3>
            </div>
            <p class="teks"></p>
        </section>
        <section class="btn-next">
            <button data-id="${data.scene}">&gt&gt</button>
        </section>
        <section class="question">
            <div class="jawab" data-id="10">
                <h5>Baiklah..</h5>
            </div>
            <div class="jawab" data-id="20">
                <h5>Maaf, biarkan aku sendiri.</h5>
            </div>
            <div class="jawab" data-id="22">
                <h5>Diam!</h5>
            </div>
        </section>
    `
}

const container = document.querySelector(".container");
let index = 1;

ajax({
    url: "data.json",
    success: data => {
        container.innerHTML = createElement(data[index-1]);
        if(data[index-1].animasi == true) {
            setTimeout(() => {
                typing(data[index-1].teks);
            }, 1000);
        }else {
            typing(data[index-1].teks);
        }
        nextScene();
    },
    error: data => {

    }
})

function nextScene() {
    const next = document.querySelector(".btn-next button");
    next.addEventListener("click", function() {
        index++;
        // console.log(index);
        ajax({
            url: "data.json",
            success: data => {
                if(index == 19 || index == 21 || index == 23) {
                    this.style.display = "none";
                    end(index);
                }else if(data[index-1].question == true) {
                    container.innerHTML = createElement2(data[index-1]);
                    pilihJawab();
                }else {
                    container.innerHTML = createElement(data[index-1]);
                    if(data[index-1].animasi == true) {
                        setTimeout(() => {
                            typing(data[index-1].teks);
                        }, 1000);
                    }else {
                        typing(data[index-1].teks);
                    }
                    nextScene();
                }
            },
            error: data => {
        
            }
        })
    })
}

function pilihJawab() {
    const jawab = document.querySelectorAll(".jawab");
    [...jawab].map(item => {
        item.addEventListener("click", function() {
            let j = parseInt(this.dataset.id);
            ajax({
                url: "data.json",
                success: data => {
                    container.innerHTML = createElement(data[j-1]);
                    if(data[j-1].animasi == true) {
                        setTimeout(() => {
                            typing(data[j-1].teks);
                        }, 1000);
                    }else {
                        typing(data[j-1].teks);
                    }
                    index = j;
                    nextScene();
                },
                error: data => {
            
                }
            })
        })
    })
}

function typing(data) {
    let i = 1;
    const teks  = document.querySelector(".teks");

    let typed = setInterval(() => {
        if(i > data.length) {
            clearInterval(typed);
        }else {
            let subTeks = data.substring(0, i);
            teks.innerHTML = subTeks;
            i++;
        }
    }, 80)
}

function end(data) {
    let end;
    if(data == 19) {
        end = `
        <section class="end" style="animation: fadeIn .6s ease-in forwards; background-color: rgba(41, 147, 233, .8);">
            <h2>Game Clear</h2>
        </section>
        `;
    }else if(data == 21 || index == 23) {
        end = `
        <section class="end" style="animation: fadeIn .6s ease-in forwards; background-color: rgba(226, 29, 29, .8);">
            <h2>Game Over</h2>
        </section>
        `;
    }
    container.innerHTML = end;
}