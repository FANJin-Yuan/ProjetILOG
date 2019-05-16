//
//  mainServer.c
//  Serveur
//
//  Created by Gabriel on 03/07/2018.
//  Copyright © 2018 Gabriel. All rights reserved.
//

#include <stdio.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>
#include <netinet/in.h>
#include <netinet/ip.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <string.h>

//Permet de savoir quand le server doit être fermé.
int finServer=0;
//Permet de déterminer quand un client a gagné
int gagne = 0;
//Thread jeu, unique a chaque client
void *processJeuServer(void *arg);
//Thread du server
void *thrServer(void *arg);
//Définition Mutex
static pthread_mutex_t mutex_solo_recv;
//Définition de la Condition
static pthread_cond_t fermetureServeur;


int main(int argc, const char * argv[]) {

	//Initialisation du Mutex
	pthread_mutex_init(&mutex_solo_recv,0);
	//Initialisation de la Condition
	pthread_cond_init(&fermetureServeur,0);

	// Creation d'un entier aléatoire
	srandom(time(NULL));
	int nombreaTrouver = random()%1000;
	//Affiche le nombre a trouver sur le server (peut être retiré)
	printf("%d\n",nombreaTrouver);

	//Création du thread Server
	pthread_t thread1;
	int iret1;
	iret1 = pthread_create( &thread1, NULL, thrServer, (void*) nombreaTrouver);
	//Permet d'attendre la fin du thread server afin de continuer le main
	pthread_cond_wait(&fermetureServeur,&mutex_solo_recv);
	//Destruction du Mutex
	pthread_mutex_destroy(&mutex_solo_recv);
	//Destruction de la Condition
	pthread_cond_destroy(&fermetureServeur);
	exit(0);
	return 0;
}

//Thread lançant le server ainsi que le thread de connection des clients
void *thrServer (void *arg){
	//Récupération dans le thread du nombre a trouver
	int *nombreaTrouver = arg;

	//Creation Serveur
	int aSock;
	aSock=socket(AF_INET,SOCK_STREAM,0);
	struct sockaddr_in aSock_serv;
	aSock_serv.sin_family=AF_INET;
	aSock_serv.sin_port=htons(49152);
	aSock_serv.sin_addr.s_addr=htonl(INADDR_ANY);
	int err = 0;
	err = bind (aSock, (struct sockaddr *)&aSock_serv, sizeof(aSock_serv));

	//Le serveur est définit en écoute et accepte
	//jusqu'à 10 connexions (peut être modifié pour en accepter plus)
	err = listen(aSock, 10);
	socklen_t casock = sizeof(aSock_serv);
	int the_Sock;
	//Boucle acceptant les connexion des client et lançant les thread jeu
	while(finServer==0){
		// Bloque en attente de connection par un client
		the_Sock = accept(aSock, (struct sockaddr *)&aSock_serv, &casock);
		pthread_t thread1;

		char *message1 = "Thread 1";
		int  iret1;
		//Stockage des arguments nécessaire au thread jeu
		int arg[2] = {the_Sock, nombreaTrouver};
		iret1 = pthread_create( &thread1, NULL, processJeuServer, (void*) arg);
	}
	//Fermeture du server
	close (aSock);
	close (the_Sock);
}

//Thread Jeu, unique a chaque client
void *processJeuServer(void *arg){
	//Récupération des arguments
	int *argument= arg;
	int the_Sock = argument[0];
	int nombreaTrouver = argument[1];

	//Boucle qui permet de continuer de jouer tant que l'un dees clients n'a pas gagné
	while (gagne==0){
		char msgRecu[256] = {0};

		// Bloque en Attente de reception du nombre comuniqué par le client
		long aNum = recv(the_Sock, msgRecu, 256, 0);
		//Le server ne peut recevoir que un message a la foi
		//afin de ne pas envoyer une fausse information au client. On bloque le mutex
		pthread_mutex_lock(&mutex_solo_recv);
		//Transformation du string reçu en int
		int nombreRecu = atoi(msgRecu);

		//Comparaison nombreRecu et nombreaTrouver
		//et stockage du message a envoyer au client
		char * msgEnvoye;
		msgEnvoye = malloc(sizeof msgEnvoye);
		if (nombreRecu==-1){
			gagne=1;
		}
		else if (nombreRecu < nombreaTrouver){
			msgEnvoye = "Plus  !";
		} else if (nombreRecu > nombreaTrouver) {
			msgEnvoye = "Moins !";
		} else {
			msgEnvoye = "Gagne !";
			gagne=1;
			finServer=1;
			//envoi du Signal indiquant la fin du thrServer
			pthread_cond_signal(&fermetureServeur);
		}
		//envoi du Message au client
		send (the_Sock,msgEnvoye,strlen(msgEnvoye),0);
		if (finServer==1){
			exit(0);
		}
		//Débloquage du Mutex
		pthread_mutex_unlock(&mutex_solo_recv);

	}

}
