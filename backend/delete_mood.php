<?php

// error_reporting(E_ALL);
// ini_set('display_errors', 1);
// header('Content-Type: application/json');

require("conn.php");

// Controlla se `uuid_phrase` e `uuid_user` sono stati inviati
if (isset($_POST['uuid_phrase']) && isset($_POST['uuid_user'])) {
    $uuid_phrase = $_POST['uuid_phrase'];
    $uuid_user = $_POST['uuid_user'];

    // Controlla se la frase appartiene a questo utente
    $checkQuery = "SELECT * FROM phrase_user WHERE phrase_uuid = ? AND user_uuid = ?";

    $stm = $conn->prepare($checkQuery);
    $stm->execute(array($uuid_phrase, $uuid_user));
    $remove_liked_phrase = $stm->fetchAll(PDO::FETCH_ASSOC)[0];

    if ($remove_liked_phrase) {

        try {
            // L'utente è autorizzato a cancellare la frase
            $deleteQuery = "DELETE FROM phrase_user WHERE phrase_uuid = ? AND user_uuid = ?";
            $stm = $conn->prepare($deleteQuery);
            $stm->execute(array($uuid_phrase, $uuid_user));
            echo json_encode(["success" => "Frase eliminata con successo"]);
        } catch (PDOException $e) {
            echo json_encode(["error" => "Errore durante l'eliminazione: " . $conn->error]);
            die("Errore eliminazione frase: " . $e->getMessage());
        }
        unset($conn);

    } else {
        // L'utente non è autorizzato a eliminare questa frase
        echo json_encode(["error" => "Permesso negato: la frase non appartiene all'utente"]);
    }
} else {
    echo json_encode(["error" => "Dati mancanti (uuid_phrase o uuid_user)"]);
}
