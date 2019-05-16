#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>
#include <netinet/in.h>
#include <netinet/ip.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <errno.h>
#include <string.h>

void *print_message_function( void *ptr );

int main()
{
	// Creation du pthread
	pthread_t threadClient;
	int  idThreadClient;

	idThreadClient = pthread_create( &threadClient, NULL, print_message_function, NULL);

	// On attend que le thread termine avant de continuer pour ne pas prendre le risque de le quitter prematurement
	pthread_join(threadClient, NULL);
	exit(0);
	return 0;
}

void *print_message_function( void *ptr )
{
	// Etablissement des donnees du serveur
	struct hostent *hostinfo = NULL;
	struct sockaddr_in Socka_imp = { 0 };
	const char *hostname ="127.0.0.1";
	int aSock;
	hostinfo = gethostbyname(hostname);
	aSock=socket(AF_INET,SOCK_STREAM,0);
	Socka_imp.sin_family=AF_INET;
	Socka_imp.sin_port=htons(49152);
	Socka_imp.sin_addr= *(struct in_addr *) hostinfo->h_addr;

	// Connexion au serveur
	int err = connect(aSock, (struct sockaddr *)&Socka_imp, sizeof(struct sockaddr));
	if (err!=-1) { // La connexion est etabli
		int idValRead;
		int nbDuClient;
		int finClient = 0;
		while (finClient == 0) {
			// on demande un nombre au client
			printf("Donner un nombre : ");
			scanf("%d", &nbDuClient);

			// on envoie le nombre choisi par le client au serveur
			char strNbDuClient[256] = {0};
			sprintf(strNbDuClient, "%d", nbDuClient);
			send (aSock,&strNbDuClient,strlen(&strNbDuClient),0);

			// On recupere la reponse dans la variable buffer
			char buffer[256] = {0};
			idValRead = read( aSock , buffer, 256);
			if (idValRead != 7) { // On deconecte le client si un autre client a gagne
				printf("Perdu ! Un autre client a deja trouve");
				finClient=1;
			} else {
				printf("%s \n", buffer); // On affche la reponse du serveur
				if (buffer[0] == 71) { // On deconecte le client si il a gagne
					finClient = 1;
				}
			}
		}
		// Fermeture de la connexion
		close(aSock);
	}
}
