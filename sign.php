<?php

// qui arriva email_login e password_login, cerchiamo di capire se esiste la email
// se esiste controlliamo che la password sia corretta, se è corretta --> accesso 01
//  altrimenti --> errore 01
// se non esiste, creiamo l'account con username e password inviati --> accesso 02
// una volta capito il messaggio da mandare, inviare la pagina in index inviando i parametri in GET

$PRE_SALT = "SALE";
$POST_SALT = "!!";

// connessione al DB locale o remoto (tramite PDO)
require("backend/conn.php");

$uuid_user = '';
$message = '';

if ($_POST['email_login']== '' || $_POST['password_login']== '') {
    die("<h1 style='color:red; text-align:center; font-size: big;'>Operazione non consentita</h1>");
}

try {

    $query = "SELECT * FROM user WHERE email_user = ?";
    $stm = $conn->prepare($query);
    $stm->execute(array($_POST['email_login']));

    $userInfo = $stm->fetchAll(PDO::FETCH_ASSOC)[0];

    if (isset($userInfo)) { // l'utente esiste, controllo se la password è la stessa
        $salted_password = md5($PRE_SALT . $_POST['password_login'] . $POST_SALT);
        if ($userInfo['password_user'] == $salted_password) { // la password è corretta
            $message = "Accesso Eseguito";
            $uuid_user = $userInfo['uuid_user'];
        } else { // utente esiste ma la password fornita non è corretta
            $message = "Password non corretta";
        }
    } else { // questa email non esiste, crealo
        $query = "INSERT INTO user (uuid_user, email_user, password_user) VALUES (UUID(), ?, ?);";
        $stm = $conn->prepare($query);

        $stm->execute(
            array(
                $_POST['email_login'],
                md5($PRE_SALT . $_POST['password_login'] . $POST_SALT),
            )
        );

        // ora che l'utente lo abbiamo inserito (e SQL gli ha assegnato un uuid nuovo), prendiamo l'uuid_che gli è appena stato assegnato
        $query = "SELECT * FROM user WHERE email_user = ?";
        $stm = $conn->prepare($query);
        $stm->execute(array($_POST['email_login']));

        $uuid_user = $stm->fetchAll(PDO::FETCH_ASSOC)[0]['uuid_user'];

        if ($uuid_user != '') {
            $message = "Utente creato, accesso eseguito";
        } else {
            $message = "Problema Server, riprova";
        }
    }
} catch (PDOException $e) {
    die("Errore-04: " . $e->getMessage());
}

unset($conn);

header("location: index.html?return=$message&uuid_user=$uuid_user");
