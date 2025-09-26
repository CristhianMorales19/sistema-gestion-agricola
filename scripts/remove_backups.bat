@echo off
REM Script para eliminar carpetas docs-backup y docs\.fix en Windows (cmd.exe)
setlocal
SET ROOT=%~dp0..
echo Root assumed: %ROOT%
pushd %ROOT%
if exist docs-backup (
  echo Deleting docs-backup folder...
  rmdir /s /q docs-backup
) else (
  echo docs-backup not found.
)
if exist docs\.fix (
  echo Deleting docs\.fix folder...
  rmdir /s /q docs\.fix
) else (
  echo docs\.fix not found.
)
popd
echo Done.
endlocal
