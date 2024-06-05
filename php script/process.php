<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $person = $_POST['person'];
    $amount = $_POST['amount'];
    $purpose = $_POST['purpose'];

    $stmt = $conn->prepare("INSERT INTO finance (person, amount, purpose, datetime) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("sds", $person, $amount, $purpose);
    $success = $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => $success]);
    exit;
} elseif ($_GET['action'] === 'fetch') {
    $result = $conn->query("SELECT * FROM finance");
    $records = [];
    while ($row = $result->fetch_assoc()) {
        $records[] = $row;
    }

    $totals = [
        'individual' => [],
        'grand' => 0
    ];

    foreach ($records as $record) {
        $totals['individual'][$record['person']] = ($totals['individual'][$record['person']] ?? 0) + $record['amount'];
        $totals['grand'] += $record['amount'];
    }

    echo json_encode(['success' => true, 'records' => $records, 'totals' => $totals]);
    exit;
}

echo json_encode(['success' => false]);
exit;

?>
