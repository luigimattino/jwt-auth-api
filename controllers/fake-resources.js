function getResources(request, response) {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(
            [
                { username: 'utente@primo.it', name: "Angy", surname: "T." },
                { username: 'utente@primo.it', name: "Chris", surname: "B." },
                { username: 'utente@secondo.it', name: "Juliana", surname: "Crain" }
            ]
        ), 100);
    });
    return promise.then(data => response.send(data.filter(resource => resource.username === request.user.login)));
};

module.exports = {
    getResources
}