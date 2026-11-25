
<?php

require_once 'koneksi.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: index.php#contact");
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if (
    $name === '' ||
    $email === '' ||
    $message === '' ||
    strlen($name) > 100 ||
    strlen($email) > 150 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL)
) {
    header("Location: index.php?contact=invalid#contact");
    exit;
}

$sql = "INSERT INTO contacts (name, email, message)
        VALUES (?, ?, ?)";

$stmt = mysqli_prepare($conn, $sql);

if (!$stmt) {
    error_log(mysqli_error($conn));
    die("Gagal menyiapkan penyimpanan pesan.");
}

mysqli_stmt_bind_param($stmt, "sss", $name, $email, $message);

if (mysqli_stmt_execute($stmt)) {
    mysqli_stmt_close($stmt);
    header("Location: index.php?contact=success#contact");
    exit;
}

error_log(mysqli_stmt_error($stmt));
mysqli_stmt_close($stmt);

die("Pesan gagal disimpan ke database.");

?>
