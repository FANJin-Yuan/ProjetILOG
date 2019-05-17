package fr.imtld.ilog;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

//Une application HttpServer avec thread
public class HttpServer implements Iapplication, Runnable {
	public static final int NORMAL = 0, PORT_CONTENTION = 1;
	protected ServerSocket _sockSvr;
	protected Thread _thr;
	protected volatile int port = 2014;
	protected ServerListener _lsn;

	
	public void addServerlistener(ServerListener lsn) {
		if(_lsn==null)
			_lsn=lsn;	
	}
	
	protected void fireStarted(String app) {
		_lsn.serverStarted(app);
	}
	
	protected void fireInit(String app) {
		_lsn.serverInit(app);
	}
	
	protected void fireStateChange(int iCause, int iPort,String app) {
		_lsn.serverStopped(iCause, iPort,app);
	}
	
	protected void fireDestroy(String app) {

		_lsn.serverDestroy(app);
	}
	
	@Override
	public void init() {
		System.out.println("Initiation HttpServer Version 1.0");
		fireInit("HttpServer");
	}

	@Override
	public void start() {
		// TODO Auto-generated method stub
		fireStarted("HttpServer");
		if (_thr == null) {
			_thr = new Thread(this);
			_thr.setDaemon(true);
			_thr.start();
		}
	}

	@Override
	public void stop() {
		// TODO Auto-generated method stub
		try {
			_sockSvr.close();
		} catch (Exception e) {
		}
	}

	@Override
	public void destroy() {
		
		_sockSvr=null;
		_thr=null;
		System.out.println("HttpServer destroy!");
		fireDestroy("HttpServer");
		
		
	}

	public static void service(Socket socket)throws Exception{

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
			
			System.out.println("HttpServer start!");
			_sockSvr = new ServerSocket(port);
			try {
				while (true) {
					Socket sock = _sockSvr.accept();
					service(sock);
				}
			} catch (IOException e) {
			
				System.out.println("HttpServer stopped!");
				fireStateChange(NORMAL,port,"HttpServer");	
			} catch (Exception e) {
				e.printStackTrace();
			}
		} catch (IOException e) {

			System.out.println("port occupe!");
			fireStateChange(PORT_CONTENTION,port,"HttpServer");
		}
		

		
	}

	

}
