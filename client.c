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
     pthread_t thread1;
     char *message1 = "Thread 1";
     int  iret1;
    /* Create independent threads each of which will execute function */

     iret1 = pthread_create( &thread1, NULL, print_message_function, (void*) message1);

     /* Wait till threads are complete before main continues. Unless we  */
     /* wait we run the risk of executing an exit which will terminate   */
     /* the process and all threads before the threads have completed.   */

     pthread_join( thread1, NULL);

     printf("Thread 1 returns: %d\n",iret1);
     exit(0);
     return 0;
}

void *print_message_function( void *ptr )
{
     char *message;
     message = (char *) ptr;
     printf("%s \n", message);
     struct hostent *hostinfo = NULL;
     struct sockaddr_in Socka_imp = { 0 };
     const char *hostname ="127.0.0.1";
     int aSock;
     hostinfo = gethostbyname(hostname);
     aSock=socket(AF_INET,SOCK_STREAM,0);
     Socka_imp.sin_family=AF_INET;
     Socka_imp.sin_port=htons(49152);
     Socka_imp.sin_addr= *(struct in_addr *) hostinfo->h_addr;
     int err = connect(aSock, (struct sockaddr *)&Socka_imp, sizeof(struct sockaddr));
     printf("err : %d \n",err);
     if (err!=-1) {
       int valread;
       char buffer[1024] = {0};
       int nb;
       int gagne = 0;
       while (gagne == 0) {
         printf("Donner un nombre : ");
         scanf("%d", &nb);
         printf("Nombre choisi : %d \n", nb);
         char strnb[256] = {0};
         sprintf(strnb, "%d", nb);
         printf("Nombre en char : %s \n", strnb);
         send (aSock,&strnb,strlen(&strnb),0);
         printf("Test \n");
         valread = read( aSock , buffer, 1024);
         printf("Valeur lu : %d \n", valread);
         printf("Buffer recu : %s \n", buffer);
         if (buffer == "Gagne !") {
           gagne = 1;
         }
       }
       close(aSock);
     }
}
