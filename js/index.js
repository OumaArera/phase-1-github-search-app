const form = document.querySelector("#github-form");
const ul = document.querySelector("#users-list");
form.addEventListener("submit", e => {
    e.preventDefault();
    let search = document.querySelector("#search").value;
    fetch(`https://api.github.com/search/users?q=${search}`, {
        headers: {'Accept': 'application/json'}
    }).then(res => res.json())
    .then(data => {
        let user_array = data.items;
        for (let user of user_array) {
            let li = document.createElement("li")
            li.innerText = user.login;
            ul.append(li);
            let p = document.createElement("p");
            p.innerHTML = `URL: <a href="${user.html_url}">${user.html_url}</a>`
            li.append(p);
            let img = document.createElement("img");
            img.src = user.avatar_url;
            img.style.height = "30px";
            img.style.weight = "20px";
            li.append(img);
            ul.append(li);
        
            li.addEventListener("click", e => {
                let repos = document.querySelector("#repos-list");
                fetch(`https://api.github.com/users/${li.innerText}/repos`, {
                    headers: {'Accept': 'application/vnd.github.v3+json'}
                }).then(res => res.json())
                .then(info => {
                    for (let repo of info){
                        let repoName = repo.name;
                        let li = document.createElement("li");
                        li.innerText = repoName;
                        repos.append(li);
                        li.style.cursor = "pointer";
                        li.addEventListener("click", function(e) {
                            let url = `https://api.github.com/repos/${li.innerText}/commits`;
                            fetch(url, {
                                headers: {'ACCEPT': 'application/json'}
                            })
                            .then(resp => resp.json())
                            .then(info => {
                                let commitUl = document.createElement("ul");
                                li.append(commitUl);
                                for (let i=0; i<info.length; i++) {
                                    let li = document.createElement("li")
                                    li.innerHTML = `${info[i].commit.author.name}: ${info[i].commit.message}`
                                    commitUl.append(li);
                                }
                            })
                        })
                    }
                })
            })
        }
    })
})
