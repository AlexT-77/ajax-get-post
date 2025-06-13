$(document).ready(function () {

    // controllare se ci sono parametri in nell'URL passati in GET, se ci sono, li ritorna a parametriGet
    function getParamethers() {
        // Ottieni l'URL corrente
        let url = window.location.href;

        // Controlla se l'URL contiene una stringa di query (parametri GET)
        if (url.indexOf('?') !== -1) {
            var parametri = {};
            var query = url.split('?')[1]; // Ottieni la stringa di query dei parametri GET

            // Dividi la stringa di query in una serie di parametri separati
            var parametriSeparati = query.split('&');

            // Loop attraverso i parametri separati
            for (var i = 0; i < parametriSeparati.length; i++) {
                var coppiaParametro = parametriSeparati[i].split('=');
                var nomeParametro = decodeURIComponent(coppiaParametro[0]);
                var valoreParametro = decodeURIComponent(coppiaParametro[1]);
                parametri[nomeParametro] = valoreParametro;
            }

            return parametri;
        } else {
            return null; // Non ci sono parametri GET
        }
    }

    parametriGet = getParamethers();
    // Se nell'URL ci sono i parametri, utilizzo il valore di return per creare un popup informativo
    // del login appena fatto
    if (parametriGet !== null) {
        // Esempio di accesso ai parametri specifici
        if (parametriGet['return'] !== null) {
            alert(parametriGet['return']);
        }

        // salvo il valore dell'uuid_user arrivato tra i parametri (sostituisce l'esistente se esiste)
        if (parametriGet['uuid_user'] != '')
            localStorage.setItem("uuid_user", parametriGet['uuid_user']);

        var urlSenzaParametri = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, urlSenzaParametri);

        // Se ho fatto il login in precedenza e sto tornando alla pagina index, controllo se ho impostato 
        // l'uuid_user nel localstorage, per evitare di far comparire la modal del login
    } else if (localStorage.getItem("uuid_user") == null) {
        showLogin();
    }

    //funzione che si collega a getPhrase.php per ricevere una frase casuale ed aggiorna l'elemento HTML
    //H1 che ha id=main_phrase
    function getPhrase() {
        $.ajax({
            url: 'backend/getPhrase.php',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                let newPhrase = data.phrase;
                currentText = newPhrase;
                uuid_phrase = data.uuid_phrase; // aggiorniamo la uuid_phrase
                $('#main_phrase').text(newPhrase);
            }
        });
    }

    function showLogin() {
        // togliere la classe "hidden" dall'elemento con id = modale-div
        let modaleDiv = document.getElementById('modale-div');
        if (modaleDiv) {
            modaleDiv.classList.remove('hidden');
        }
    }

    let currentText = null;
    let uuid_phrase = null;
    let login = localStorage.getItem("uuid_user");

    // al primo caricamento della pagina, controllo se è stato fatto il login: in caso negativo 
    // apparirà la maschera per farlo
    if (login) {
        getPhrase();
    }

    $("#btn_reload").on("click", function () {
        getPhrase();
    });

    $("#profile_img").on("click", function () {
        // controllo se sei già loggato o no
        // se sei loggato: ti porto nella pagina del profilo
        // se non sei loggato: ti mostro username/password per loggarti o creare il profilo

        if (localStorage.getItem("uuid_user")) {
            document.location.href = "profile.html";
        } else {
            showLogin();
        }
    });

    $("#btn_share").on("click", function () {
        if (navigator.share) {
            navigator.share({
                text: 'Ho trovato una frase interessante: ' + currentText
            });
        } else {
            alert("Condivisione non disponibile su questo dispositivo");
        }
    });

    // Alla pressione del tasto LIKE, invio a likeElement uuid_phrase e uuid_user per memorizzarli nella
    // tabella user_phrase e tracciare la o le frasi preferite
    $("#btn_like").on("click", function () {

        let uuid_user = localStorage.getItem('uuid_user');

        if (uuid_user !== '' && uuid_user !== null) {
            $.ajax({
                url: 'backend/likeElement.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    "uuid_phrase": uuid_phrase,
                    "uuid_user": uuid_user
                },
                success: function (data) {
                    let answare = data.result;
                    let text_for_alert = "Errore Server :(";

                    answare = answare.toString();

                    switch (answare) {
                        case "1":
                            // hai messo like al post con successo
                            text_for_alert = "Hai messo like con successo.";
                            break;
                        case "0":
                            // errore: non hai account
                            text_for_alert = "Registrati per mettere like.";
                            break;

                        default:
                            // errore: server
                            break;
                    }

                    alert(text_for_alert);
                },
                error: function (xhr, status, error) {
                    // Gestisci eventuali errori qui
                }
            });
        } else { // l'utente non risulta loggato, fai vedere l'azione di login
            showLogin();
        }

    });




    // Apri la modale quando si clicca sul logo
    $("#logo").on("click", function () {
        $("#rating-modal").addClass("show").removeClass("hidden");
    });

    // Chiudi la modale
    $("#close-modal").on("click", function () {
        $("#rating-modal").removeClass("show").addClass("hidden");
    });

    // Gestisci l'invio del form
    $("#rating-form").on("submit", function (e) {
        e.preventDefault();
        let rating = $("input[name='rating']:checked").val();
        if (rating) {

            let text_for_alert = "Errore Server :(";
            $.ajax({
                url: 'backend/mood.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    "rate_mood": rating,
                    "uuid_user": login
                },
                success: function (data) {
                    let answare = data.result;

                    answare = answare.toString();

                    switch (answare) {
                        case "1":
                            text_for_alert = "Forza, andrà meglio!";
                            break;
                        case "2":
                            text_for_alert = "Un passo alla volta.";
                            break;
                        case "3":
                            text_for_alert = "Sei sulla buona strada!";
                            break;
                        case "4":
                            text_for_alert = "Ottima energia oggi!";
                            break;
                        case "5":
                            text_for_alert = "Al top della felicità!";
                            break;
                        case "0":
                            // errore: non hai account
                            text_for_alert = "C'è stato un errore nel salvataggio del tuo Mood.";
                            break;
                    }

                    alert(text_for_alert);
                },
                error: function (xhr, status, error) {
                    console.log("Errore AJAX:", status, error, xhr.responseText); // DEBUG
                }
            });

            $("#rating-modal").removeClass("show").addClass("hidden"); // Chiudi la modale
        }
    });

});