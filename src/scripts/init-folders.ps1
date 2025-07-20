$folders = @(
  "controllers",
  "models",
  "routes",
  "services",
  "middlewares",
  "config",
  "cli",
  "public",
  "data",
  "tests"
)

foreach ($folder in $folders) {
  New-Item -ItemType Directory -Path $folder -Force
  New-Item -ItemType File -Path "$folder/.gitkeep" -Force | Out-Null
}



//Correr en terminal powershell para inicializar con .gitkeep

//powershell -ExecutionPolicy Bypass -File .\scripts\init-folders.ps1
