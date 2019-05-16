package fr.imtld.ilog;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;

public class Client {
	public static void main(String[] args) {
		// forsure http request uri
		String uri="index.htm";
		if (args.length!=0) {
			uri=args[0];
		}
		doGet("localhost",2014,uri);
		
}
	private static void doGet(String host, int port, String uri) {
		try {
			Socket sock = new Socket( host, 2014 );
			
        	StringBuffer sb=new StringBuffer("GET "+uri+" HTTP/1.1\r\n");

    		OutputStream socketOut=sock.getOutputStream();
    		PrintWriter pw = new PrintWriter(socketOut, true);
    		String strtoserver = sb.toString();
    		pw.println(strtoserver);
    		
    		InputStream is = sock.getInputStream();
        	InputStreamReader isr = new InputStreamReader( is );
        	BufferedReader br = new BufferedReader( isr );
        	System.out.println(br.readLine());

        	
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
}
	
