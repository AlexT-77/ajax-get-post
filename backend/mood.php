<?php

$toReturn = 0;

// connessione al DB locale o remoto (tramite PDO)
require("conn.php");

$user = '';
$rating = '';

$user = $_POST['uuid_user'];
$rating = $_POST['rate_mood'];

// echo $user.' '.$rating;

try {
    $query = "INSERT INTO mood (uuid_mood, rate_mood, user_uuid) VALUES (UUID(), ?, ?);";
    $stm = $conn->prepare($query);
    $stm->execute(array($rating, $user));

    $toReturn = $rating;
    unset($conn);
} catch (PDOException $e) {
    die("Errore-02: " . $e->getMessage());
}

die(json_encode(
    array(
        "result" => $toReturn
    )
));
