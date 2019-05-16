package fr.imtld.ilog;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.text.DateFormat;
import java.util.Calendar;
import java.util.Date;

public class DayTimeServer implements Iapplication,Runnable{
	public static final int NORMAL = 0, PORT_CONTENTION = 1;
	protected ServerSocket _sockSvr;
	protected Thread _thr;
	protected volatile int port = 2013;
	protected ServerListener _lsn;
//	ByteArrayOutputStream baoStream;
//	PrintStream cacheStream;

	
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
		// TODO Auto-generated method stub
	//	_calendar=Calendar.getInstance();

		System.out.println("Initiation DayTimeServer V2!");
		fireInit("DayTimeServer");

	}

	@Override
	public void start() {
		if (_thr == null) {
			_thr = new Thread(this);
			_thr.setDaemon(true);
			_thr.start();
//			try {
//				_thr.join();
//			} catch (InterruptedException e) {
//				
//				e.printStackTrace();
//			}
		}
	}

	@Override
	public void stop() {
		// TODO Auto-generated method stub
		try {
			_sockSvr.close();
		} catch (Exception e) {
		}
//		baoStream = new ByteArrayOutputStream(1024);
//		cacheStream = new PrintStream(baoStream);
//		System.setOut(cacheStream);
//		System.out.println("DayTimeServer stop!");
//		_lsn.asyncupdateUI(baoStream,"DayTimeServer");
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		_sockSvr=null;
		_thr=null;
		System.out.println("DayTimeServer destroy!");
		fireDestroy("DayTimeServer");
		
		
		
	}
	
	protected void changeinfo(Socket sock, DateFormat formater) throws IOException {
		String strTime = formater.format(new Date());
		OutputStream os = sock.getOutputStream();
		PrintWriter pw = new PrintWriter(os, true);
		pw.println(strTime);
		pw.close();
		sock.close();
		
	}

	@Override
	public void run() {
	//	init();
		try {
			
			System.out.println("DayTimeServer start!");
			fireStarted("DayTimeServer");
			DateFormat formater = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG);
			_sockSvr = new ServerSocket(port);
			try {
				while (true) {
					Socket sock = _sockSvr.accept();
					changeinfo(sock,formater);
				}
			} catch (IOException e) {
		
				System.out.println("DayTimeServer stopped!");
				fireStateChange(NORMAL,port,"DayTimeServer");	
			}
		} catch (IOException e) {

			System.out.println("port occupe!");
			fireStateChange(PORT_CONTENTION,port,"DayTimeServer");
		}
		
	}

}
