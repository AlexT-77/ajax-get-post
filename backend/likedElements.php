<?php

// rispondi con un array di stringhe al quale l'utente $_POST['uuid_user'] ha messo like

// l'array dovrà avere le seguenti informazioni: uuid_phrase | text_phrase

// connessione al DB locale o remoto (tramite PDO)
require("conn.php");

try {

    $query = "SELECT COUNT(P.text_phrase) NumLike, P.text_phrase text_phrase, P.uuid_phrase uuid_phrase, PU.timestamp_phrase timestamp_mood
        FROM phrase P INNER JOIN phrase_user PU ON PU.phrase_uuid = P.uuid_phrase
        WHERE PU.user_uuid = ?
        GROUP BY PU.phrase_uuid
        ORDER BY NumLike DESC;";
    $stm = $conn->prepare($query);
    $stm->execute(array($_POST['uuid_user']));

    $liked_phrases = $stm->fetchAll(PDO::FETCH_ASSOC);

    $toReturn = array();
    foreach ($liked_phrases as $liked_phrase) {
        $toReturn[] = array(
            "NumLike" => $liked_phrase['NumLike'],
            "uuid_phrase" => $liked_phrase['uuid_phrase'],
            "text_phrase" => $liked_phrase['text_phrase']
        );
    }
    unset($conn);

} catch (PDOException $e) {
    die("Errore-02: " . $e->getMessage());
}

die(json_encode(
    array(
        "result" => $toReturn
    )
));
