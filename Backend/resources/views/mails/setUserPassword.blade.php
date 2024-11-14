<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reestablecer Contraseña</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin: 20px auto;
            max-width: 600px;
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .header img {
            max-width: 150px;
        }
        .content {
            text-align: center;
            padding: 20px;
        }
        .content h1 {
            font-size: 24px;
            color: #333;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            color: #555;
        }
        .button {
            background-color: #4CAF50;
            color: white;
            padding: 15px 25px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
            border-radius: 5px;
            font-size: 16px;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #777;
            padding: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.metalicasmundialltda.com/wp-content/uploads/elementor/thumbs/cropped-LOGO-MM-REGISTRADO-FINAL-RGB-oxam0xwhzeegbelx1jilijh3z4bnwidxvymln61pi0.png" alt="Logo de Metálicas Mundial LTDA">
        </div>
        <div class="content">
            <h1>Solicitud de Restablecimiento de Contraseña</h1>
            <p>Hola, {{$data['name']}}</p>
            <p>Se ha generado una solicitud para restablecer tu contraseña en el sistema de cotizaciones.</p>
            <p>Para generar tu contraseña, haz clic en el siguiente enlace:</p>
            <a href="{{$data['link']}}" class="button">Generar Contraseña</a>
            <p>Si tienes algún problema, por favor contáctanos.</p>
        </div>
        <div class="footer">
            <p>Metálicas Mundial LTDA © 2024</p>
        </div>
    </div>
</body>
</html>
