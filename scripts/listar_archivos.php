<?php
// --- scripts/listar_archivos.php ---
header('Content-Type: application/json');

$base_dir = '../fotos/';
$directory = isset($_GET['dir']) ? trim($_GET['dir']) : '';
$directory = str_replace('\\', '/', $directory);
if (strpos($directory, 'fotos/') === 0) {
    $directory = substr($directory, strlen('fotos/'));
}
$directory = ltrim($directory, '/');

if ($directory === '') {
    echo json_encode([]);
    exit;
}

$target_path = $base_dir . $directory;
$base_path = realpath($base_dir);

if (!is_dir($target_path)) {
    echo json_encode([]);
    exit;
}

$safe_path = realpath($target_path);

if ($safe_path === false || $base_path === false || strpos($safe_path, $base_path) !== 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Ruta de directorio no válida.']);
    exit;
}

// Buscar solo archivos de imagen
$files = glob($safe_path . '/*.{jpg,jpeg,png,gif,webp}', GLOB_BRACE);
$image_urls = [];

if ($files !== false) {
    foreach ($files as $file) {
        // Devolver la URL relativa desde la raíz del sitio
        $image_urls[] = 'fotos/' . $directory . '/' . basename($file);
    }
}

echo json_encode($image_urls);
?>
