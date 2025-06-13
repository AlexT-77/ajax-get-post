<?php

// connessione al DB locale o remoto (tramite PDO)
require("conn.php");

try {
    $query = "SELECT * FROM phrase ORDER BY RAND() LIMIT 1;";
    $stm = $conn->prepare($query);
    $stm->execute();
    $newPhraseInfo = $stm->fetchAll(PDO::FETCH_ASSOC)[0];
    $newPhraseString = $newPhraseInfo['text_phrase'];
    $newPhraseUuid = $newPhraseInfo['uuid_phrase'];

    unset($conn);
} catch (PDOException $e) {
    die("Errore-02: " . $e->getMessage());
}

echo json_encode(
    array(
        "phrase" => $newPhraseString,
        "uuid_phrase" => $newPhraseUuid
    )
);

die();
