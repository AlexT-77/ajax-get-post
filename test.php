<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <div class="form-group">
        <form action="test.php" method="post">
            <label for="">Username</label>
            <input type="text" name="username" id=""  placeholder="Create user"><br>
            <label for="">Count</label>
            <input type="text" name="count" id=""  placeholder="Insert count"><br>
            <label for="">Description</label>
            <input type="text" name="description" id="" placeholder="Insert a description"><br>
            <label for="">Duration</label>
            <input type="text" name="duration" id="" placeholder="Insert duration"><br>
            <label for="">Date</label>
            <input type="text" name="date" id="" placeholder="Insert a date"><br><br>
            <button type="submit" name="submit" value="submit">Submit</button>
            <button type="submit" name="get" value="get">GET</button>
        </form><br><br>

        <style>
      		table {
      			border:1px solid #b3adad;
      			border-collapse:collapse;
      			padding:5px;
      		}
      		table th {
      			border:1px solid #b3adad;
      			padding:5px;
      			background: #f0f0f0;
      			color: #313030;
      		}
      		table td {
      			border:1px solid #b3adad;
      			text-align:center;
      			padding:5px;
      			background: #ffffff;
      			color: #313030;
      		}
      	</style>
    </div>

    <script>
      $(document).ready(function(){
        let invio_post=<?php if ($_POST['submit']==''){echo 0;}else{echo 1;}?>;
        let invio_get=<?php if ($_POST['get']==''){echo 0;}else{echo 1;}?>;

        if(invio_post){
          const username="<?php echo $_POST['username']; ?>";
          const count="<?php echo $_POST['count']; ?>";
          const description="<?php echo $_POST['description']; ?>";
          const duration="<?php echo $_POST['duration']; ?>";
          const date="<?php echo $_POST['date']; ?>";

          const postData={
            username: username,
            count: count,
            description: description,
            duration: duration,
            date: date
          };

          let str_postData=JSON.stringify(postData);

          $.ajax({
           url: "write.php",
           type: "POST",
           data: {info: str_postData},
           success: function(response) {
            alert('Insert successful!');
            },
            error: function(response) {
                console.log(response);
            }
        });

        }else if (invio_get) {
          $.ajax({
           url: "read.php",
           type: "GET",
           dataType: "json",
           success: function(response) {
            const num_obj=Object.keys(response).length;

            let body=document.getElementsByTagName('body')[0];
            let table = document.createElement('table');
            let thead = document.createElement('thead');
            let tbody = document.createElement('tbody');

            let tr_th=document.createElement('tr');
            let th_username=document.createElement('th');
            let th_count=document.createElement('th');
            let th_description=document.createElement('th');
            let th_duration=document.createElement('th');
            let th_data=document.createElement('th');

            th_username.innerHTML='USER';
            th_count.innerHTML='COUNT';
            th_description.innerHTML='DESCRIPTION';
            th_duration.innerHTML='DURATION';
            th_data.innerHTML='DATA';

            tr_th.appendChild(th_username);
            tr_th.appendChild(th_count);
            tr_th.appendChild(th_description);
            tr_th.appendChild(th_duration);
            tr_th.appendChild(th_data);

            thead.appendChild(tr_th);

            for (let i = 0; i < num_obj; i++) {
              let row=document.createElement('tr');
              for (let key in response[i]){
                  let td=document.createElement('td');
                  td.innerHTML=response[i][key];
                  row.appendChild(td);
              }
              tbody.appendChild(row);
            }


            table.appendChild(thead);
            table.appendChild(tbody);
            body.appendChild(table);

            },
            error: function(response) {
                console.log(response);
            }
        });
        }
      });
    </script>
</body>
</html>
