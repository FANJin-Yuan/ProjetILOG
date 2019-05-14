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



int main(int argc, const char * argv[]) {

	// Creation d'un entier aléatoire
	srandom(time(NULL));
	int nombreaTrouver = random()%1000;
	int gagne = 0;
	printf("%d\n",nombreaTrouver);

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

	// Bloque en attente de connection par un client
	int the_Sock = accept(aSock, (struct sockaddr *)&aSock_serv, &casock);
	while (gagne==0){
		char msgRecu[256] = {0};
		printf("passe\n");
		// Bloque en Attente de reception
		long aNum = recv(the_Sock, msgRecu, 256, 0);
		printf ("%s", msgRecu);
		int nombreRecu = atoi(msgRecu);
		printf("%d",nombreRecu);

		//Comparaison nombreRecu et nombreaTrouver
		char * msgEnvoye;
		msgEnvoye = malloc(sizeof msgEnvoye);
		if (nombreRecu==-1){
			gagne=1;
		}
		else if (nombreRecu < nombreaTrouver){
			msgEnvoye = "Plus  !";
			printf("%d",nombreRecu);
		} else if (nombreRecu > nombreaTrouver) {
			msgEnvoye = "Moins !";
		} else {
			msgEnvoye = "Gagne !";
			gagne=1;
		}
		printf("%s",msgEnvoye);
		send (the_Sock,msgEnvoye,strlen(msgEnvoye),0);
	}

	//Fermeture du server
	close (aSock);
	close (the_Sock);

	return 0;
}
