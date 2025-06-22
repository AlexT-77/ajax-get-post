<?Php

  $dati=$_POST['info'];

  $arr=json_decode($dati, true);

  $mysqli = new mysqli('host', 'username', 'password', 'dbname');
  if ($mysqli->connect_error) {
    die('Errore di connessione (' . $mysqli->connect_errno . ') '. $mysqli->connect_error);
  } else {

    if(!$arr['date']){
      $data=date('Y-m-d');
    }else {
      $data=$data=(strpos('/',$arr['date'])) ? str_replace('/','-',date_format(date_create($arr['date']),'Y-m-d')) : date_format(date_create($arr['date']),'Y-m-d');
    }

    $username=$mysqli -> real_escape_string($arr['username']);
    $description=$mysqli -> real_escape_string($arr['description']);

    $query="INSERT INTO users (username, count, description, duration, data) VALUES ('$username', $arr[count],'$description',$arr[duration], '$data')";
    if (!$result = $mysqli->query($query)) {
      die('Errore di inserimento  (' . $mysqli->error . ') '. $mysqli->error);
    }
  }

  $mysqli->close();

?>
