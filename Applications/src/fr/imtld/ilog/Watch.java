package fr.imtld.ilog;
import java.util.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.Socket;
import java.util.Date;
public class Watch {
	Date date = new Date();
    protected void displayLocalTime() {
            System.out.println(date);
    }
    public static void main( String args[] ) {
            Watch watch = new Watch();

            watch.displayServerTime(args[0],"CET");
            
    }
    
    public void displayServerTime(String strServer,String str) {
    	try {
    		InetAddress addr = InetAddress.getByName(strServer);
        	Socket sock = new Socket( addr, 2013 );
        	InputStream is = sock.getInputStream();
        	InputStreamReader isr = new InputStreamReader( is );
        	BufferedReader br = new BufferedReader( isr );
        	System.out.println(is);
        	
        	OutputStream os = sock.getOutputStream();
    		System.out.println(os);
    		PrintWriter pw = new PrintWriter(os, true);
    		String strtoserver = str;
    		pw.println(strtoserver);
    		
    		String strDateTime = br.readLine();
    		System.out.println("ServerTime:"+strDateTime);
    		
        	sock.close();
    	}
    		catch(IOException e) {System.out.println("erreur!");}
    }
}