#!/bin/bash

# =====================================================
# SCRIPT DE INSTALACIÓN AUTOMÁTICA
# Sistema de Gestión Agrícola - Ubuntu/Linux
# =====================================================

set -e  # Salir si hay algún error

echo "🚀 INSTALACIÓN AUTOMÁTICA - SISTEMA DE GESTIÓN AGRÍCOLA"
echo "======================================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes coloridos
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Paso 1: Verificar si MySQL está instalado
print_step "1. Verificando MySQL..."
if ! command -v mysql &> /dev/null; then
    print_warning "MySQL no está instalado. Instalando..."
    sudo apt update
    sudo apt install -y mysql-server mysql-client
    sudo systemctl start mysql || sudo service mysql start
    print_status "MySQL instalado correctamente"
else
    print_status "MySQL ya está instalado"
fi

# Paso 2: Verificar que MySQL esté funcionando
print_step "2. Verificando servicio MySQL..."
if sudo systemctl is-active --quiet mysql 2>/dev/null || sudo service mysql status >/dev/null 2>&1; then
    print_status "MySQL está funcionando"
else
    print_warning "Iniciando servicio MySQL..."
    sudo systemctl start mysql || sudo service mysql start
fi

# Paso 3: Solicitar credenciales de MySQL root
print_step "3. Configuración de acceso a MySQL..."
echo -n "Ingresa la contraseña de MySQL root (Enter si no tiene): "
read -s MYSQL_ROOT_PASSWORD
echo ""

# Probar conexión
if [ -z "$MYSQL_ROOT_PASSWORD" ]; then
    MYSQL_CMD="mysql"
else
    MYSQL_CMD="mysql -p$MYSQL_ROOT_PASSWORD"
fi

# Paso 4: Verificar conexión a MySQL
print_step "4. Probando conexión a MySQL..."
if $MYSQL_CMD -e "SELECT 1;" >/dev/null 2>&1; then
    print_status "Conexión a MySQL exitosa"
else
    print_error "No se puede conectar a MySQL. Verifica la contraseña."
    exit 1
fi

# Paso 5: Ejecutar instalación de base de datos
print_step "5. Instalando base de datos..."

# Verificar que estamos en el directorio correcto
if [ ! -f "INSTALAR_NUEVO_EQUIPO.sql" ]; then
    print_error "Archivo INSTALAR_NUEVO_EQUIPO.sql no encontrado"
    print_error "Ejecuta este script desde la carpeta /database/"
    exit 1
fi

# Ejecutar instalación
print_status "Ejecutando instalación de la base de datos..."
$MYSQL_CMD < INSTALAR_NUEVO_EQUIPO.sql

if [ $? -eq 0 ]; then
    print_status "✅ Base de datos instalada correctamente"
else
    print_error "❌ Error durante la instalación"
    exit 1
fi

# Paso 6: Configurar archivo .env para backend
print_step "6. Configurando backend..."

if [ -f "../backend/.env.example" ]; then
    if [ ! -f "../backend/.env" ]; then
        cp ../backend/.env.example ../backend/.env
        print_status "Archivo .env creado desde .env.example"
    else
        print_warning "Archivo .env ya existe, no se sobrescribe"
    fi
else
    print_warning "No se encontró archivo .env.example en backend/"
fi

# Mostrar resumen final
echo ""
echo "🎉 ¡INSTALACIÓN COMPLETADA!"
echo "=========================="
echo ""
echo "📊 RESUMEN:"
echo "  • Base de datos: gestion_agricola"
echo "  • Tablas creadas: 33"
echo "  • Usuario BD: app_agricola"
echo "  • Contraseña BD: App123!Segura"
echo ""
echo "🔐 CREDENCIALES WEB:"
echo "  • Usuario: admin@gestionagricola.com"
echo "  • Contraseña: Admin123!"
echo ""
echo "⚠️  IMPORTANTE:"
echo "  • Cambia las contraseñas en producción"
echo "  • El backend puede usar las credenciales del .env"
echo "  • La base de datos está lista para desarrollo"
echo ""
echo "🚀 ¡Listo para comenzar el desarrollo!"
