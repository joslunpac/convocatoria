## Configuración paso a paso de un VPS Ubuntu 22.04
# General

Iniciamos sesión con sudo (`root`).
```bash
$ ssh root@ip_servidor
```

Actualizamos el índice de paquetes del servidor
```bash
$ sudo apt update
$ sudo apt upgrade
```

**1. Creación de un nuevo usuario**

Iniciamos sesión con sudo (`root`).
```bash
$ ssh root@ip_servidor
```

Creamos el nuevo usuario.
```bash
$ adduser dev
```

Ahora podemos ver una nueva carpeta `/home/dev` para el nuevo usuario.

Otorgamos todos los privilegios del usuario sudo (`root`).
```bash
$ usermod -aG sudo dev
```

Nos desconectamos del servidor, e iniciamos sesión de nuevo, pero ahora con dev.
Deberíamos ver éste nuevo usuario de color verde.
```bash
$ exit
$ ssh dev@[ipservidor]

dev@[nombreservidor]:~$
```

**2. Directorio para los proyectos**

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Comprobamos si nos encontramos el su directorio.
```bash
$ pwd
```

Debe salir lo siguiente `/home/dev`.

Creamos el directorio donde alojaremos los distintos proyectos que deseemos.
```bash
$ mkdir projects
```

# Github
**1. Conectar con nuestra cuenta de Github**

Iniciamos sesión en nuestra cuenta de Github, y en `Settings > Developer settings > Personal access tokens (classic)` generamos un nuevo token de acceso.

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Establecemos el usuario e email de Github con los siguientes comandos:
```bash
$ git config --global user.name "nombre_de_usuario"
$ git config --global user.email "tu_correo@ejemplo.com"
$ git config --global credential.helper cache
$ git config -l
```

Reemplazamos `nombre_de_usuario` y `tu_correo@ejemplo.com` con nuestro nombre y dirección de correo electrónico de GitHub, respectivamente.

**2. Clonar un repositorio**

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Nos ubicamos sobre el directorio `/home/dev/projects` y clonamos el repositorio.
```bash
$ git clone https://github.com/nombre_de_usuario/nombre_repositorio.git
```

Donde `nombre_de_usuario` es nuestro nombre de Github y `nombre_repositorio` es el nombre del repositorio que queremos clonar.

A continuación nos solicitará el usuario y contraseña. Recuerda que ahora la contraseña pasa a ser el token que creamos previamente.

# Nginx (Servidor Web)
**1. Instalación de Nginx**

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Actualizamos el índice de paquetes del servidor e instalamos Nginx.
```bash
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install nginx
$ sudo apt update
$ sudo apt upgrade
```

Comprobamos si se ha instalado correctamente y está activo el servicio de Nginx.
```bash
$ sudo systemctl status nginx
```

Verificamos la instalación accediendo a la dirección ip del servidor en el navegador, y debemos ver la pantalla de bienvenida de Nginx.

**3. Configuración genérica del servidor web**

Evitamos u posible problema de meoria del subi hash que puede surgir al agregar nombre de servidores adicionales.
```bash
$ sudo nano /etc/nginx/nginx.conf
```

Dentro del archivo, buscamos la directiva `server_sanmes_hash_bucket_size 64;` y la descomentamos.

Reiniciamos el servico de nginx.
```bash
$ sudo systemctl restart nginx
```

**4. Configuración del Firewall del servidor web**

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Abrimos el puerto 80 (tráfico web normal, no cifrado) y el puerto 443 (tráfico TLS/SSL cifrado).
```bash
$ sudo ufw allow 'Nginx Full'
```

Abrimos el puerto 22 (conexión ssh).
```bash
$ sudo ufw allow 'OpenSSH' comment 'Habilitar el acceso ssh'
```

Abrimos el puerto 8090 (Puerto en el que escucha el backend).
```bash
$ sudo ufw allow 8090 comment 'Habilitar el acceso al backend desde el exterior'
```

Abrimos el puerto 3306 (Conexión MySQL).
```bash
$ sudo ufw allow mysql comment 'Habilitar el acceso a MySQL desde el exterior'
$ sudo ufw insert 1 allow from ip_servidor to any port 3306
```

Comprobamos que `ufw` esté activo.
```bash
$ sudo ufw status
```

Si está inactivo, lo activamos.
```bash
$ sudo ufw enable
```

Si no reconoce el comando `ufw`, ejecuta el siguiente comando y luego vuelve a probar.
```bash
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install ufw
$ sudo apt update
$ sudo apt upgrade
```

Reiniciamos el servico de nginx.
```bash
$ sudo systemctl restart nginx
```

**5. Configuración de bloques de servidor**

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Para un servidor que aloja una sola página, basta con modificar el bloque de servidor por defecto de Nginx. Para ello vamos al directorio `/etc/nginx/sites-available` y ejecutamos el siguiente comando.
```bash
$ sudo nano default
```

Para que Ngnix no arroje un 404 al actualizar una pagina, hay que poner la 
propiedad `try_files` a `$uri $uri/ /index.html;`.

Comprobamos que no haya errores de sintaxis en los archivos de Nginx.
```bach
$ sudo nginx -t
```

Reiniciamos el servico de nginx.
```bash
$ sudo systemctl restart nginx
```

# Base de datos (MySQL)
**1. Instalación de MySQL y configuración inicial**

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Actualizamos el índice de paquetes del servidor e instalamos MySQL.
```bash
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install mysql-server mysql-client
$ sudo apt update
$ sudo apt upgrade
```

Entramos en MySQL.
```bash
$ sudo mysql
```

Ejecutamos el comando `alter user` para cambiar el método de autenticación del usuario `root` a uno que use una contraseña. El siguiente ejemplo cambia el método de autenticación a `mysql_native_password`.
```bash
mysql> alter user 'root'@'localhost' identified with mysql_native_password by 'password';
```

Salimos de MySQL.
```bash
mysql> exit
```

Ejecutamos el script de seguridad.
```bash
$ sudo mysql_secure_installation
```

Introducimos la contraseña creada previamente y realizamos los siguientes pasos:
- Configurar el complemento de validación de contraseña: `No`
- Cambiar la contraseña para `root`: `No`
- Eliminar usuarios anonimos: `Si`
- Deshabilitar el login remoto: `Si`
- Borrar base de datos test: `Si`
- Recargar privilegios: `Si`

Una vez que se completa el script de seguridad, volvemos a abrir MySQL y cambiamos el método de autenticación del usuario `root` al predeterminado `auth_socket`. Para autenticarnos como usuario `root` de MySQL usando una contraseña, ejecutamos el siguiente comando.
```bash
$ mysql -u root -p
```

Volvemos a usar el método de autenticación predeterminado con este comando.
```bash
mysql> alter user 'root'@'localhost' identified with auth_socket;
```

Esto significará que podemos volver a conectarnos a MySQL como usuario `root` sin contraseña, usando el comando `sudo mysql`.

Salimos de MySQL.
```bash
mysql> exit
```

**2. Creación de la base de datos**

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Entramos en MySQL.
```bash
$ sudo mysql
```

Creamos la base de datos.
```bash
mysql> create database databasename;
```

Creamos un nuevo usuario que solamente pueda conectarse desde el propio servidor.
```bash
mysql> create user 'usernamedb'@'localhost' identified by 'usernamedb';
```

Damos privilegios sobre la nueva tabla al nuevo usuario.
```bash
mysql> grant all privileges on databasename.* to 'usernamedb'@'localhost' with grant option;

mysql> flush privileges;
```

Salimos de MySQL
```bash
mysql> exit
```

Nos logamos con `usernamedb`.
```bash
$ mysql -u usernamedb -p
```

**3. Conexión remota a la base de datos**

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Entramos en MySQL.
```bash
$ sudo mysql
```

Creamos un usuario que pueda conectarse remotamente (`%`).
```bash
mysql> create user 'usernamedb'@'%' identified by 'usernamedb';
```

Damos privilegios sobre la tabla al nuevo usuario.
```bash
mysql> grant all privileges on databasename.* to 'usernamedb'@'%' with grant option;

mysql> flush privileges;
```

Salimos de MySQL.
```bash
mysql> exitmvn install
```

Editamos el fichero `/etc/mysql/mysql.conf.d/mysqld.cnf`.
```bash
$ sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Para permitir la conexión desde cualquier ip, comentamos la línea `bind-address=127.0.0.1`, lo que es lo mismo que cambiar `127.0.0.1` por `0.0.0.0`.

Reiniciamos MySQL.
```bash
$ sudo systemctl restart mysql.service
```

Abrimos el puerto `3306` de MySql. Desde el panel de clouding.io, vamos a la opción `Mis Firewalls` y pulsamos el signo `+` para añadir una nueva regla al firewall. Seleccionamos la plantilla que queremos utilizar, en nuestro caso `Permitir MySql` y pulsamos el signo `+` para que nos muestre los datos de la plantilla. Lo dejamos todo por defecto y pulsamos enviar para crear la regla.

# Backend (Spring Boot Application)
**1. Instalación de Maven**

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Actualizamos el índice de paquetes del servidor e instalamos Maven.
```bash
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install maven
$ sudo apt update
$ sudo apt upgrade
```

Comprobamos si se ha instalado correctamente ejecutando el siguiente comando.
```bash
$ mvn -version
```

**2. Instalación de JDK**

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Actualizamos el índice de paquetes del servidor e instalamos JDK.
```bash
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install default-jdk
$ sudo apt update
$ sudo apt upgrade
```

Comprobamos si se ha instalado correctamente ejecutando el siguiente comando.
```bash
$ java -version
```

**3. Despliegue de la aplicación Spring Boot**

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Nos dirijimos al directorio donde alojamos el backend `/home/dev/projects/mi_proyecto` y ejecutamos los siguientes comandos.
```bash
$ mvn clean
$ mvn install
```

Ejecutamos la aplicación y comprobamos que todo haya ido correctamente. Para ello, sobre el directorio del proyecto, que es `/home/dev/projects/mi_proyecto`, ejecutamos el siguiente comando.
```bash
$ java -jar target/nombre_jar.jar
```

Reemplazamos `nombre_jar` por el nombre creado para nuestro fichero.jar.

**4. Crear un servicio para arrancar y parar la aplicación**

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Creamos el fichero `mi_proyecto.service` y lo alojamos en la ruta de servicios del sistema.
```bash
$ sudo nano /etc/systemd/system/mi_proyecto.service
```

Esto abrirá el editor de texto para completar el archivo. Ponemos lo siguiente.
```bash
[Unit]
Description=Mi proyecto
After=syslog.target

[Service]
User=dev
ExecStart=/usr/bin/java -jar /home/dev/projects/mi_proyecto/target/nombre_jar.jar
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

Pulsamos `crtl + o` y luego `Enter`, para así guardar el fichero. Luego `ctrl + x` para salir del editor.

Añadimos el nuevo sercicio al arranque de inicio del sistema, de manera que cuando se reinicie el servidor Ubuntu, nuestro proyecto se arranque automáticamente.
```bash
$ sudo systemctl enable mi_proyecto.service
```

Por último, abrimos el puerto `8090` que es donde se arranca el proyecto. Desde el panel de clouding.io, vamos a la opción `Mis Firewalls` y pulsamos el signo `+` para añadir una nueva regla al firewall. Seleccionamos la plantilla que queremos utilizar, en nuestro caso `Norma personalizada` y pulsamos el signo `+` para que nos muestre los datos de la plantilla. Indicamos `TCP`, `8090`, `8090`, `0.0.0.0/0`, anadimos una descripción y pulsamos enviar para crear la regla.

# Frontend (Angular Application)
**1. Instalación de nvm**

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Actualizamos el índice de paquetes del servidor e instalamos nvm.
```bash
$ sudo apt update
$ sudo apt upgrade
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
$ sudo apt update
$ sudo apt upgrade
```

Volvemos a cargar la configuración básica del usuario.
```bash
$ source ~/.bashrc
```

Comprobamos si se ha instalado correctamente ejecutando el siguiente comando.
```bash
$ nvm
```

**2. Instalación de node**

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Actualizamos el índice de paquetes del servidor e instalamos la última versión estable de node.
```bash
$ sudo apt update
$ sudo apt upgrade
$ nvm install --lts
$ sudo apt update
$ sudo apt upgrade
```

Comprobamos si se ha instalado correctamente ejecutando el siguiente comando.
```bash
$ node --version
```

**3. Instalación de Angular CLI**

Iniciamos sesión con `dev`.
```bash
$ ssh dev@ip_servidor
```

Actualizamos el índice de paquetes del servidor e instalamos Angular CLI.
```bash
$ sudo apt update
$ sudo apt upgrade
$ npm install -g @angular/cli
$ sudo apt update
$ sudo apt upgrade
```

**5. Preparación de SPA de la aplicación Angular**

Iniciamos sesión con dev.
```bash
$ ssh dev@ip_servidor
```

Nos dirijimos al directorio donde alojamos el frontend `/home/dev/projects/mi_proyecto`.

Generamos la carpeta `node_modules`.
```bash
$ npm install
```

Compilamos el proyecto para producción y generamos la carpeta `dist`.
```bash
$ ng build --configuration production
```

Comprobamos que ha generado el código del SPA en el directorio `/home/dev/projects/mi_proyecto/dist/mi_proyecto`.

**5. Despliegue del frontend**

Borramos el contenido del directorio `/var/www/html` y copiamos el SPA generado en `/home/dev/projects/mi_proyecto/dist/mi_proyecto`.

Para verificar que todo ha ido correctamente, ponemos en el navegador la dirección ip de nuestro servidor, y deberíamos ver la aplicación angular.

# Utiles

cp -r # copia archivos y carpetas

sudo rm -R /var/www/html/*

sudo cp -r /home/dev/projects/convocatoria/convocatoria-frontend/dist/convocatoria/* /var/www/html/

sudo cp -r /var/www/index.nginx-debian_copia.html /var/www/html/index.nginx-debian.html

Ver el espacio usado en disco en el servidor
sudo df -h

Ver el espacio usado en disco en un directorio
sudo du -hs * | sort -h

sudo du -sh /