<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reestablecimiento de Contraseña</title>
    <style>
        body {
            background-color: #121212;
            color: #ffffff;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background-color: #1e1e1e;
            border-radius: 8px;
            padding: 20px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
        .logo img {
            max-width: 100%;
            height: auto;
            margin-bottom: 20px;
        }
        h2 {
            margin-top: 0;
            font-size: 24px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
        }
        input {
            width: 70%;
            padding: 10px;
            margin-bottom: 16px;
            border: 1px solid #333;
            border-radius: 4px;
            background-color: #2c2c2c;
            color: #ffffff;
            font-size: 14px;
        }
        button {
            background-color: red;
            border: none;
            color: #ffffff;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="https://www.metalicasmundialltda.com/wp-content/uploads/elementor/thumbs/cropped-LOGO-MM-REGISTRADO-FINAL-RGB-oxam0xwhzeegbelx1jilijh3z4bnwidxvymln61pi0.png" alt="Logo">
        </div>
        <h2>Reestablecer contraseña</h2>
        @if ($errors->any())
            <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
                @endforeach
            </ul>
            </div>
        @endif
        <!-- mensaje de éxito -->
        @if (session('status'))
            <div class="alert alert-success" style="color: #28a745; margin-bottom: 16px;">
            {{ session('status') }}
            </div>
        @endif

        <form action="{{ route('resetPassword') }}" method="post">
            @csrf
            <input type="hidden" name="reset_password_token" value="{{ $token }}">
            <label for="new-password">Nueva Contraseña:</label>
            <input type="password" id="new-password" name="password" required>
            <label for="password_confirmation">Confirmar Nueva Contraseña:</label>
            <input type="password" id="password_confirmation" name="password_confirmation" required>
            <button type="submit">Actualizar Contraseña</button>
        </form>
    </div>


</body>
</html>
