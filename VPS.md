## Configuración paso a paso de un VPS Ubuntu 22.04
# MySQL
**1. Instalación de MySQL y configuración inicial**

Actualizamos el índice de paquetes del servidor e instalamos MySQL
```bash
$ sudo apt update
$ sudo apt install mysql-server mysql-client
$ sudo apt update
```

Entramos en MySQL
```bash
$ sudo mysql
```

Ejecutamos el comando `alter user` para cambiar el método de autenticación del usuario `root` a uno que use una contraseña. El siguiente ejemplo cambia el método de autenticación a `mysql_native_password`:
```bash
mysql> alter user 'root'@'localhost' identified with mysql_native_password by 'password';
```

Salimos de MySQL
```bash
misql> exit
```

Ejecutamos el script de seguridad
```bash
$ sudo mysql_secure_installation
```

Introducimos la contraseña creada previamente y realizamos los siguientes pasos:
- Configurar el complemento de validación de contraseña: `No`
- Cambiar la contraseña para root: `No`
- Eliminar usuarios anonimos: `Si`
- Deshabilitar el login remoto: `Si`
- Borrar base de datos test: `Si`
- Recargar privilegios: `Si`

Una vez que se completa el script de seguridad, volvemos a abrir MySQL y cambiamos el método de autenticación del usuario `root` al predeterminado `auth_socket`. Para autenticarnos como usuario `root` de MySQL usando una contraseña, ejecutamos el siguiente comando:
```bash
$ mysql -u root -p
```

Luego, volvemos a usar el método de autenticación predeterminado con este comando:
```bash
mysql> alter user 'root'@'localhost' identified by auth_socket;
```

Esto significará que podemos volver a conectarnos a MySQL como usuario `root` sin contraseña, usando el comando `sudo mysql`.

Salimos de MySQL
```bash
mysql> exit
```

**2. Creación de la base de datos**

Entramos en MySQL
```bash
$ sudo mysql
```

Creamos la base de datos
```bash
mysql> create database convocatoria;
```

Creamos un nuevo usuario que solamente pueda conectarse desde el propio servidor
```bash
mysql> create user ‘convocatoriadb’@'localhost' identified by 'convocatoriadb';
```

Damos privilegios sobre la nueva tabla al nuevo usuario
```bash
mysql> grant all privileges on convocatoria.* to 'convocatoriadb'@'localhost' with grant option;

mysql> flush privileges;
```

Salimos de MySQL
```bash
mysql> exit
```

Nos logamos con el nuevo usuario
```bash
$ mysql -u convocatoriadb -p
```

**3. Conexión remota a la base de datos**

Entramos en MySQL
```bash
$ sudo mysql
```

Creamos un usuario que pueda conectarse remotamente (`%`)
```bash
mysql> create user 'convocatoriadb'@'%' identified by 'convocatoriadb';
```

Damos privilegios sobre la tabla al nuevo usuario
```bash
mysql> grant all privileges on convocatoria.* to 'convocatoriadb'@'%' with grant option;

mysql> flush privileges;
```

Salimos de MySQL
```bash
mysql> exit
```

Ahora editamos el fichero `/etc/mysql/mysql.conf.d/mysqld.cnf`
```bash
$ nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Para permitir la conexión desde cualquier ip, comentamos la línea `bind-address=127.0.0.1`, lo que es lo mismo que cambiar `127.0.0.1` por `0.0.0.0`.

Reiniciamos MySQL
```bash
$ service mysql restart
```

Por último, abrimos el puerto `3306` de MySql. Desde el panel de clouding.io, vamos a la opción `Mis Firewalls` y pulsamos el signo `+` para añadir una nueva regla al firewall. Seleccionamos la plantilla que queremos utilizar, en nuestro caso `Permitir MySql` y pulsamos el signo `+` para que nos muestre los datos de la plantilla. Lo dejamos todo por defecto y pulsamos enviar para crear la regla.

### Comandos útiles para MySQL
```bash
- Mostramos las bases de datos existentes
mysql> show databases;

- Mostramos los usuarios existentes
mysql> select user, host from mysql.user;
```