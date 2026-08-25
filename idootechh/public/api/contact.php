<?php
declare(strict_types=1);

// Contact form backend for idootech.com.ng — replaces the Netlify Function
// (netlify/functions/contact.js) that has no equivalent on the VPS. Secrets
// (recipient/from address) live in a gitignored config.php created once on
// the server (see config.example.php) — never committed.

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'Method not allowed']);
}

$configPath = __DIR__ . '/config.php';
$config = is_file($configPath) ? require $configPath : [];

$raw = file_get_contents('php://input');
$body = json_decode($raw ?: '{}', true);
if (!is_array($body)) {
    respond(400, ['error' => 'Invalid JSON body']);
}

$name = trim((string)($body['name'] ?? ''));
$email = trim((string)($body['email'] ?? ''));
$subject = trim((string)($body['subject'] ?? ''));
$message = trim((string)($body['message'] ?? ''));

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    respond(400, ['error' => 'All fields are required']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['error' => 'Invalid email address']);
}

if (strlen($name) > 200 || strlen($subject) > 300 || strlen($message) > 5000) {
    respond(400, ['error' => 'One or more fields are too long']);
}

// mail() headers are newline-delimited — strip CR/LF from anything that
// lands in a header to block header-injection via the form fields.
$headerSafe = static fn(string $v): string => str_replace(["\r", "\n"], '', $v);

$recipient = $config['recipient'] ?? 'info@idootech.com.ng';
$fromAddress = $config['from_address'] ?? 'no-reply@idootech.com.ng';

$emailBody = "Name: {$name}\nEmail: {$email}\nSubject: {$subject}\n\n{$message}\n";

$headers = implode("\r\n", [
    'From: IdooTech Website <' . $headerSafe($fromAddress) . '>',
    'Reply-To: ' . $headerSafe($email),
    'Content-Type: text/plain; charset=UTF-8',
]);

$sent = mail(
    $headerSafe($recipient),
    '[IdooTech] New message from ' . $headerSafe($name),
    $emailBody,
    $headers
);

if (!$sent) {
    respond(500, ['error' => 'Your message was not delivered. Please try again.']);
}

respond(200, ['ok' => true]);
