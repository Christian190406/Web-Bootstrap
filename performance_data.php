
<?php
require_once 'koneksi.php';

header('Content-Type: application/json; charset=utf-8');

$sql = "SELECT category, percentage FROM performance ORDER BY id ASC";

$result = mysqli_query($conn, $sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "error" => "Gagal mengambil data performance"
    ]);
    exit;
}

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = [
        "category" => $row['category'],
        "percentage" => (float) $row['percentage']
    ];
}

echo json_encode($data);

mysqli_free_result($result);
mysqli_close($conn);
?>
