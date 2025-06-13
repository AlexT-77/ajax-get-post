<?php

if ($_SERVER['SERVER_NAME'] === 'localhost' || $_SERVER['SERVER_NAME'] === '127.0.0.1') {
    // Codice per localhost
    $host = "localhost";
    $dbname = "dbwe_98";
    $username = "root";
    $password = "";
} else {
    // connetterci al DB (tramite PDO)
    $host = "localhost";
    $dbname = "dbbdyh1lrytgik";
    $username = "u0qv5kpazzj9q";
    $password = "Amerini16!";

    try {
        $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    } catch (PDOException $e) {
        die("Errore connessione al DB: " . $e->getMessage());
    }
}
