# PowerShell Static File HTTP Server using .NET HttpListener
$port = 5173
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

$Cwd = $PSScriptRoot
if (-not $Cwd) { $Cwd = Get-Location }

Write-Output "HTTP server starting..."
try {
    $listener.Start()
    Write-Output "HTTP server running successfully!"
    Write-Output "Access local preview at: http://localhost:$port/"
    Write-Output "------------------------------------------------"
    Write-Output "Press Ctrl+C in this console to terminate server."
    Write-Output "------------------------------------------------"
    
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            # Parse target path
            $localPath = $request.Url.LocalPath
            if ($localPath -eq "/") { $localPath = "/index.html" }
            
            # Clean leading slashes and resolve full local path
            $cleanPath = $localPath.TrimStart('/')
            $filePath = [System.IO.Path]::Combine($Cwd, $cleanPath)
            
            if (Test-Path $filePath -PathType Leaf) {
                # Read files and output them with correct MIME types
                [byte[]]$bytes = [System.IO.File]::ReadAllBytes($filePath)
                
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                switch ($ext) {
                    ".html" { $response.ContentType = "text/html; charset=utf-8" }
                    ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                    ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                    ".png"  { $response.ContentType = "image/png" }
                    ".jpg"  { $response.ContentType = "image/jpeg" }
                    ".jpeg" { $response.ContentType = "image/jpeg" }
                    ".gif"  { $response.ContentType = "image/gif" }
                    ".svg"  { $response.ContentType = "image/svg+xml" }
                    default { $response.ContentType = "application/octet-stream" }
                }
                
                # Atomically write bytes, set Content-Length, and close response
                $response.Close($bytes, $false)
            } else {
                $response.StatusCode = 404
                [byte[]]$errBytes = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 File Not Found</h1><p>Path '$localPath' was not found on this server.</p>")
                $response.ContentType = "text/html; charset=utf-8"
                $response.Close($errBytes, $false)
            }
        }
        catch {
            Write-Output "Exception handled during request: $_"
            # Attempt to close response if it hasn't been closed
            if ($response) {
                try {
                    $response.StatusCode = 500
                    [byte[]]$errBytes = [System.Text.Encoding]::UTF8.GetBytes("<h1>500 Internal Server Error</h1><p>$($_.Exception.Message)</p>")
                    $response.Close($errBytes, $false)
                } catch {
                    # Ignore secondary errors during abortive close
                }
            }
        }
    }
} catch {
    Write-Error $_
} finally {
    if ($listener) {
        $listener.Close()
        Write-Output "HTTP server stopped."
    }
}
