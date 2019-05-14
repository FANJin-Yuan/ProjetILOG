package fr.imtld.ilog;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.text.DateFormat;
import java.util.Calendar;
import java.util.Date;

public class DayTimeServer implements Iapplication,Runnable{
	protected ServerSocket _sockSvr;
	protected Thread _thr;
	protected volatile int port = 2013;

	@Override
	public void init() {
		// TODO Auto-generated method stub
	//	_calendar=Calendar.getInstance();
		System.out.println("Initiation DayTimeServerv2!");
		
	}

	@Override
	public void start() {
		System.out.println("DayTimeServer start!");
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
		System.out.println("DayTimeServer stop!");
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		System.out.println("DayTimeServer destroy!");
		_sockSvr=null;
		_thr=null;
		
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
			DateFormat formater = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG);
			_sockSvr = new ServerSocket(port);
			try {
			//	while (_bRun) {
					Socket sock = _sockSvr.accept();
					changeinfo(sock,formater);
			//	}
			} catch (IOException e) {
			}
		} catch (IOException e) {
			System.err.println("Port occupe!");
		}
		
	}

}
