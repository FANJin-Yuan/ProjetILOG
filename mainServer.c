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

int finServer=0;
int gagne = 0;
void *processJeuServer(void *arg);
void *thrServer(void *arg);
static pthread_mutex_t mutex_solo_recv;
static pthread_cond_t fermetureServeur;


int main(int argc, const char * argv[]) {

	pthread_mutex_init(&mutex_solo_recv,0);
	pthread_cond_init(&fermetureServeur,0);

	// Creation d'un entier aléatoire
	srandom(time(NULL));
	int nombreaTrouver = random()%1000;
	printf("%d\n",nombreaTrouver);

	pthread_t thread1;
	int iret1;
	iret1 = pthread_create( &thread1, NULL, thrServer, (void*) nombreaTrouver);
	pthread_cond_wait(&fermetureServeur,&mutex_solo_recv);
	pthread_mutex_destroy(&mutex_solo_recv);
	pthread_cond_destroy(&fermetureServeur);
	exit(0);
	return 0;
}

void *thrServer (void *arg){
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

	//Le serveur est définit en écoute
	err = listen(aSock, 10);
	socklen_t casock = sizeof(aSock_serv);
	int the_Sock;
	while(finServer==0){
		// Bloque en attente de connection par un client
		the_Sock = accept(aSock, (struct sockaddr *)&aSock_serv, &casock);
		pthread_t thread1;

		char *message1 = "Thread 1";
		int  iret1;
		/* Create independent threads each of which will execute function */
		int arg[2] = {the_Sock, nombreaTrouver};
		iret1 = pthread_create( &thread1, NULL, processJeuServer, (void*) arg);
	}
	//Fermeture du server
	close (aSock);
	close (the_Sock);
}

void *processJeuServer(void *arg){
	int *argument= arg;
	int the_Sock = argument[0];
	int nombreaTrouver = argument[1];
	while (gagne==0){
		char msgRecu[256] = {0};

		// Bloque en Attente de reception
		long aNum = recv(the_Sock, msgRecu, 256, 0);
		pthread_mutex_lock(&mutex_solo_recv);
		int nombreRecu = atoi(msgRecu);

		//Comparaison nombreRecu et nombreaTrouver
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
			pthread_cond_signal(&fermetureServeur);
		}
		send (the_Sock,msgEnvoye,strlen(msgEnvoye),0);
		if (finServer==1){
			exit(0);
		}
		pthread_mutex_unlock(&mutex_solo_recv);

	}

}
