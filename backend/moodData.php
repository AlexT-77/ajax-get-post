<?php

require("conn.php");

// Leggi i dati JSON inviati dal client
$data = json_decode(file_get_contents("php://input"), true);

// Se i dati non sono validi, restituisci un errore
if (isset($data['user_uuid'])) {
    // Apri il file per il logging (opzionale)
    // $myfile = fopen("newfile.txt", "w") or die("Unable to open file!");
    // $txt = json_encode($data);
    // fwrite($myfile, $txt);
    // fclose($myfile);

    // Prepara la query
    $query = "SELECT rate_mood, timestamp_mood FROM mood WHERE user_uuid = ? ORDER BY timestamp_mood ASC";
    $stm = $conn->prepare($query);
    $stm->execute(array($data['user_uuid']));
    $moodData = $stm->fetchAll(PDO::FETCH_ASSOC);

    // tolgo la parte dell'ora
    foreach ($moodData as $key => $value) {
        $moodData[$key]['timestamp_mood'] = explode(' ', $value['timestamp_mood'])[0];
    }

    unset($conn);
    // Restituisci i dati come JSON
    echo json_encode($moodData);
} else {
    // Se il parametro 'user_uuid' non è presente, restituisci un errore
    echo json_encode(['error' => 'user_uuid non fornito']);
}
