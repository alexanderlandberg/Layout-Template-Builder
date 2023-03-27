export const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>%%title%%</title>
    <link href="https://use.typekit.net/abo0dqe.css" rel="stylesheet">
    <link rel="stylesheet" href="https://info.marel.com/landingpage-styles">
    <link rel="icon" type="image/png" sizes="32x32" href="https://storage.pardot.com/645703/62302/favicon_32x32.png">
</head>
<body>
    <div id="main-container">
        <header id="header">
            [htmlHeader]
        </header>
        <main role="main" id="main-content">
            [htmlMain]
        </main>
        <footer id="footer">
            [htmlFooter]
        </footer>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="https://info.marel.com/landingpage-script"></script>
</body>
</html>`