<?Php
$mysqli = new mysqli('host', 'username', 'password', 'dbname');
if ($mysqli->connect_error) {
  die('Errore di connessione (' . $mysqli->connect_errno . ') '. $mysqli->connect_error);
} else {
  $query="SELECT * FROM users";
  $arr_dati=array();

  if ($result = $mysqli->query($query)) {
    while ($row = $result->fetch_assoc()) {
      $tmp['username']=$row['username'];
      $tmp['count']=$row['count'];
      $tmp['description']=$row['description'];
      $tmp['duration']=$row['duration'];
      $tmp['data']=$row['data'];
      array_push($arr_dati, $tmp);
    }
    echo json_encode($arr_dati);
  }
  $mysqli->close();
}
?>
