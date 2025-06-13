<?php

$toReturn = 0;

if (!isset($_POST['uuid_phrase']) || !isset($_POST['uuid_user'])) {
    die(json_encode(
        array(
            "result" => $toReturn
        )
    ));
} else {

    // connessione al DB locale o remoto (tramite PDO)
    require("conn.php");

    try {

        // qui gestiamo una frase che riceve il like da un utente
        // $_POST['phrase'] --> la frase in testo
        // $_POST['uuid_user'] --> l'utente in uuid_user

        $query = "INSERT INTO phrase_user (phrase_uuid, user_uuid) VALUES (?,?);";
        $stm = $conn->prepare($query);
        $stm->execute(
            array(
                $_POST['uuid_phrase'],
                $_POST['uuid_user']
            )
        );

        $toReturn = 1;
        unset($conn);
    } catch (PDOException $e) {
        die("Errore-02: " . $e->getMessage());
    }

    die(json_encode(
        array(
            "result" => $toReturn
        )
    ));
}
