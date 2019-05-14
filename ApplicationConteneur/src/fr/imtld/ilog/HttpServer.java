package fr.imtld.ilog;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;


public class HttpServer implements Iapplication, Runnable {
	protected ServerSocket _sockSvr;
	protected Thread _thr;
	protected volatile int port = 2014;
	@Override
	public void init() {
		System.out.println("Initiation HttpServer");
	}

	@Override
	public void start() {
		// TODO Auto-generated method stub
		System.out.println("HttpServer start!");
		if (_thr == null) {
			_thr = new Thread(this);
			_thr.setDaemon(true);
			_thr.start();
			try {
				_thr.join();
			} catch (InterruptedException e) {
				
				e.printStackTrace();
			}
		}
	}

	@Override
	public void stop() {
		// TODO Auto-generated method stub
		try {
			_sockSvr.close();
		} catch (Exception e) {
		}

		System.out.println("HttpServer stop!");
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		System.out.println("HttpServer destroy!");
		_sockSvr=null;
		_thr=null;
	}

	public static void service(Socket socket)throws Exception{
		
//		int size=socketIn.available();
//		byte[] buffer=new byte[size];
		
    	InputStream is = socket.getInputStream();
    	InputStreamReader isr = new InputStreamReader( is );
    	BufferedReader br = new BufferedReader( isr );
    	String request = br.readLine();
    	System.out.println(request);
    	
    	String responseFirstLine="HTTP/1.1 200 OK\r\n";
    	OutputStream os=socket.getOutputStream();
    	PrintWriter pw = new PrintWriter(os, true);
    	pw.write(responseFirstLine);

    	pw.close();
		socket.close();
		
	}
	@Override
	public void run() {
		try {
		//	DateFormat formater = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG);
			_sockSvr = new ServerSocket(port);
			try {
					Socket sock = _sockSvr.accept();
					service(sock);
		
			} catch (IOException e) {}
			catch (Exception e) {
				e.printStackTrace();
			}
		} catch (IOException e) {
			System.err.println("Port occupe!");
		}

		
	}

	

}
