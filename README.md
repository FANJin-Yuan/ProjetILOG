# ILOG2019
Threads POSIX / synchro sous Linux

# Description du produit

Jeu du juste prix. Le serveur choisi un nombre aléatoirement et les clients doivent trouver ce nombre a travers des indications venant du serveur (Plus ou Moins).

Les clients sont les uns contre les autres, le premier qui trouve le prix a gagné. Bon jeu a tous et que le meilleur gagne !!!

# Manuel d'utilisation

Télécharger les fichiers suivant : client.c et serveur.c

## Compilation

Les commandes suivantes sont a appliquer dans le dossier où l'on a téléchargé les fichiers.

- Compilation du client

 - pour Mac OS

  ```
  gcc -o client client.c
  ```

 - pour Linux

  ```
  gcc -o client client.c -lpthread
  ```

- Compilation du serveur

 - pour Mac OS

  ```
  gcc -o server server.c
  ```

 - pour Linux

  ```
  gcc -o server server.c -lpthread
  ```

## Éxecution

Ouvrir plusieurs shell (une pour le serveur et les autres pour le nomnbre de clients souhaités)

lancer la comande suivante dans le dossier on on a compiler les fichiers.c pour démarrer le serveur

```
./serveur
```

lancer la commande suivante lancer la comande suivante dans le dossier on on a compiler les fichiers.c pour démarrer le client

```
./clients
```

## Concept utilisé
Nous avons utilisés du multithreading grâce au **threads POSIX** avec leurs fonctionalités **mutex** et **condition** ansi que des sockets TCP pour faire cmmuniquer le serveur et les clients
