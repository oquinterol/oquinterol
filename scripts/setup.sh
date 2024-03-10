#!/bin/bash
echo "Configurando una nueva maquina...."
read -p "Nombre del equipo: " MACHINE

Create_SSH() {
    # Crea el directorio ~/.ssh si aún no existe
    mkdir -p ~/.ssh/
    # Genera un nuevo par de claves SSH, reemplazando $MACHINE con el nombre de tu máquina o identificador único
    ssh-keygen -t rsa -b 4096 -C "$MACHINE" -f ~/.ssh/$MACHINE
    # Añade o actualiza la configuración en ~/.ssh/config para el host
    # Comprueba si ya existe la configuración para el host y la actualiza o añade una nueva
    local config_path="$HOME/.ssh/config"
    local host_entry="Host quinterol.github.com\n\tHostname github.com\n\tPreferredAuthentications publickey\n\tIdentityFile ~/.ssh/$MACHINE\n\tIdentitiesOnly yes"
    
    if grep -q "Host quinterol.github.com" "$config_path"; then
        # Si ya existe una entrada para el host, se podría actualizar aquí.
        echo "Una entrada para 'quinterol.github.com' ya existe en $config_path. Omitiendo la adición."
    else
        # Si no existe, añade la nueva entrada al final del archivo config
        echo -e "$host_entry" >> "$config_path"
        echo "Añadida nueva entrada para 'quinterol.github.com' en $config_path."
    fi
}
Dotfiles() {
    # Define el directorio donde se clonarán los dotfiles
    local dotfiles_dir="$HOME/.dotfiles"
    # Clona el repositorio de dotfiles
    git clone git@quinterol.github.com:quinterol/dotfiles.git "$dotfiles_dir" || {
        echo "Error al clonar el repositorio de dotfiles."
        return 1
    }
    # Cambia al directorio de dotfiles
    cd "$dotfiles_dir" || {
        echo "No se pudo cambiar al directorio de dotfiles."
        return 1
    }
     # Usa GNU Stow con la opción --adopt para el directorio completo
    stow --adopt -v -t "$HOME" -d "$dotfiles_dir" * || {
        echo "Error al aplicar Stow para los dotfiles."
        return 1
    }
    cd $HOME || {
        echo "Error al ir a la carpeta $HOME"
    }
    echo "Dotfiles clonados y gestionados con éxito."
}


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
        apt update; apt upgrade -y
        apt install ssh bash-completion 
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