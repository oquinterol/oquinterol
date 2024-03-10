#!/bin/bash
echo "Setup new machine...."

# Identificar la distribución de Linux
if [ -f /etc/os-release ]; then
    # Cargará /etc/os-release si existe
    . /etc/os-release
    DISTRO=$NAME
elif type lsb_release >/dev/null 2>&1; then
    # lsb_release está disponible
    DISTRO=$(lsb_release -si)
else
    echo "Distribución no identificada."
    exit 1
fi

# Realizar acciones basadas en la distribución identificada
case $DISTRO in
    Debian*|Ubuntu*)
        echo "Estás en Debian o Ubuntu"
        # Comandos específicos para Debian/Ubuntu
        ;;
    Arch*|Manjaro*)
        echo "Estás en Arch Linux o Manjaro"
        # Comandos específicos para Arch/Manjaro
        ;;
    *)
        echo "Distribución no soportada: $DISTRO"
        exit 1
        ;;
esac