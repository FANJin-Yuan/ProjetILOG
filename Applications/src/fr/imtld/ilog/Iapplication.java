package fr.imtld.ilog;


public interface Iapplication {
	public static final int NORMAL = 0, PORT_CONTENTION = 1;
	
	public void init();
	public void start();
	public void stop();
	public void destroy();
	public void addServerlistener(ServerListener lsn);
	

}
