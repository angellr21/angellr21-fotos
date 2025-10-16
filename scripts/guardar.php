<?php
// --- scripts/guardar.php ---

// Configuración básica de seguridad y respuesta
header('Content-Type: application/json');
$response = ['error' => 'Acceso no autorizado.'];
$method = $_SERVER['REQUEST_METHOD'];

// Simulación de autenticación (en un proyecto real, usar sesiones)
// Por ahora, asumimos que si se llega aquí, está "autenticado".

if ($method !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode($response);
    exit;
}

// Rutas de las carpetas
$events_file = '../events.json';
$photos_dir = '../fotos/';

// Asegurarse de que la carpeta de fotos exista
if (!file_exists($photos_dir)) {
    mkdir($photos_dir, 0777, true);
}

try {
    $event_data = $_POST;
    $uploaded_files = $_FILES['galeria_imagenes'] ?? [];
    
    $events = file_exists($events_file) ? json_decode(file_get_contents($events_file), true) : [];
    if (!is_array($events)) {
        $events = [];
    }

    $event_id = $event_data['id'] ?? null;
    if (!$event_id) {
        throw new Exception('El identificador del evento es obligatorio.');
    }

    // Manejo de eliminación de eventos
    if (isset($event_data['delete']) && $event_data['delete'] === 'true') {
        $initial_count = count($events);
        $events = array_values(array_filter($events, function ($event) use ($event_id) {
            return $event['id'] !== $event_id;
        }));

        if ($initial_count === count($events)) {
            throw new Exception('El evento no existe.');
        }

        $event_dir = $photos_dir . $event_id . '/';
        if (is_dir($event_dir)) {
            $iterator = new RecursiveDirectoryIterator($event_dir, RecursiveDirectoryIterator::SKIP_DOTS);
            $files = new RecursiveIteratorIterator($iterator, RecursiveIteratorIterator::CHILD_FIRST);
            foreach ($files as $file) {
                if ($file->isDir()) {
                    rmdir($file->getRealPath());
                } else {
                    unlink($file->getRealPath());
                }
            }
            rmdir($event_dir);
        }

        file_put_contents($events_file, json_encode($events, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        $response = ['success' => true, 'message' => 'Evento eliminado correctamente.', 'eventos' => $events];
        http_response_code(200);
        echo json_encode($response);
        exit;
    }

    $event_dir = $photos_dir . $event_id . '/';
    if (!file_exists($event_dir)) {
        mkdir($event_dir, 0777, true);
    }

    $image_paths = [];
    if (!empty($uploaded_files['name'][0])) {
        $file_count = count($uploaded_files['name']);
        for ($i = 0; $i < $file_count; $i++) {
            $file_name = basename($uploaded_files['name'][$i]);
            $target_path = $event_dir . $file_name;
            
            // Mover el archivo subido a su destino final
            if (move_uploaded_file($uploaded_files['tmp_name'][$i], $target_path)) {
                $image_paths[] = 'fotos/' . $event_id . '/' . $file_name;
            }
        }
    }

    $portada = $event_data['portada'] ?? '';
    // Si se subieron nuevas imágenes y la portada no es una URL completa, se asume que es un archivo local
    if (!empty($image_paths) && !filter_var($portada, FILTER_VALIDATE_URL)) {
         $portada_path = 'fotos/' . $event_id . '/' . basename($portada);
    } else {
         $portada_path = $portada;
    }

    $new_event = [
        'id' => $event_id,
        'titulo' => $event_data['titulo'] ?? '',
        'fecha' => $event_data['fecha'] ?? '',
        'lugar' => $event_data['lugar'] ?? '',
        'descripcion' => $event_data['descripcion'] ?? '',
        'portada' => $portada_path,
        'directorio' => 'fotos/' . $event_id
    ];

    // Buscar si el evento ya existe para actualizarlo, si no, añadirlo
    $found_index = -1;
    foreach ($events as $index => $event) {
        if ($event['id'] === $event_id) {
            $found_index = $index;
            break;
        }
    }

    if ($found_index !== -1) {
        $events[$found_index] = $new_event;
    } else {
        $events[] = $new_event;
    }

    // Guardar el archivo JSON actualizado
    file_put_contents($events_file, json_encode($events, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    $response = ['success' => true, 'message' => 'Evento guardado correctamente.', 'eventos' => $events];
    http_response_code(200);

} catch (Exception $e) {
    $response = ['error' => $e->getMessage()];
    http_response_code(400);
}

echo json_encode($response);
?>
