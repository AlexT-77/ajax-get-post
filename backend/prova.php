<?php

require("conn.php");


// Se i dati non sono validi, restituisci un errore
if (1) {

    // Prepara la query
    $query = "SELECT rate_mood, timestamp_mood FROM mood WHERE user_uuid = ? ORDER BY timestamp_mood ASC";
    $stm = $conn->prepare($query);
    $stm->execute(array("76b26988-eee0-11ef-a20b-00163e3bf950"));
    $moodData = $stm->fetchAll(PDO::FETCH_ASSOC);

    unset($conn);

    echo "<pre>";
    print_r($moodData);
    echo "<pre><br><br>";

    // Restituisci i dati come JSON
    echo json_encode($moodData);
    
} else {
    // Se il parametro 'user_uuid' non è presente, restituisci un errore
    echo json_encode(['error' => 'user_uuid non fornito']);
}
