$(document).ready(function () {

    // Ottieni il riferimento al div con ID "all_phrases"
    let allPhrasesDiv = document.getElementById('all_phrases');

    // Ottieni il riferimento al paragrafo con ID "to_duplicate_p"
    let toDuplicateP = document.getElementById('to_duplicate_p');

    let uuid_user = localStorage.getItem('uuid_user');

    $.ajax({
        url: 'backend/likedElements.php',
        type: 'POST',
        dataType: 'json',
        data: {
            "uuid_user": uuid_user
        },
        success: function (data) {
            let all_liked_phrases = data.result;
            console.log(all_liked_phrases);

            all_liked_phrases.forEach(liked_phrase => {

                // Duplica il paragrafo e cambia l'ID
                let nuovoParagrafo = toDuplicateP.cloneNode(true);
                nuovoParagrafo.id = liked_phrase.uuid_phrase;

                // Crea una nuova icona per ogni paragrafo
                let icon = document.createElement('span');
                icon.classList.add('fas', 'fa-trash');
                icon.style.cursor = 'pointer';
                icon.style.marginRight = '5px';
                icon.style.color = '#3b2c2cc7'; // Per maggiore visibilità

                // Aggiungi evento click per rimuovere solo questo paragrafo
                icon.addEventListener('click', function () {
                    $.ajax({
                        url: 'backend/delete_mood.php',
                        type: 'POST',
                        data: {
                            "uuid_phrase": nuovoParagrafo.id,
                            "uuid_user": uuid_user
                        },
                        success: function (response) {
                            let jsonResponse = JSON.parse(response); // Converti la stringa JSON in oggetto
                            alert(jsonResponse.success);
                            nuovoParagrafo.remove(); // Rimuove il paragrafo dalla UI solo se l'operazione ha successo
                        },
                        error: function (xhr, status, error) {
                            console.error(response.error, error);
                        }
                    });
                });

                // genero tanti cuori quanti solo i like che ho messo per la frase
                let hearts = "";
                for (let i = 0; i < liked_phrase.NumLike * 1; i++) {
                    hearts += "❤️";
                }

                // nuovoParagrafo.textContent = liked_phrase.timestamp_mood; // per ora non la usiamo
                nuovoParagrafo.innerHTML = `${liked_phrase.text_phrase}${"&nbsp;".repeat(5)}${hearts}`;

                // Inserisci l'icona all'inizio del paragrafo
                nuovoParagrafo.prepend(icon);

                // Aggiungi il nuovo paragrafo al div "all_phrases"
                allPhrasesDiv.appendChild(nuovoParagrafo);
            });
        },
        error: function (xhr, status, error) {
            // Gestisci eventuali errori qui
        }
    });

});