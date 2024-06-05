<?php
    $server = "localhost";
    $username = "root";
    $password = "";
    $dbname = "test";
    
    $conn = new mysqli($server, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $id = $_POST['id'];

        $fetch_sql = "SELECT person,amount FROM finance WHERE id='$id'";
        $result = $conn->query($fetch_sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $amount = $row['amount'];
            $person = $row['person'];


        $sql = "DELETE FROM finance WHERE id='$id'";

        if ($conn->query($sql) === TRUE) {
            $response["status"] = "success";
            $response["message"] = "Record deleted successfully";
            $response["amount"] = $amount;
            $response["person"] = $person;
            
        } else {
            $response["message"] = "Error: " . $conn->error;
        } 

     } else 
        
        {

            $response["message"] = "Record not found";
        }
        
        $conn->close();
    }
        echo json_encode($response);
?>