package test;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

import com.fazecast.jSerialComm.SerialPort;

@RunWith(SuitePlus.class)
@SuiteClasses({ FifoTest.class, FifoTest2.class })
public class AllTests {

	static SerialPort serialPort;

	public static void main(String[] args) throws Exception {

		Result result = JUnitCore.runClasses(AllTests.class);

		// attempt to connect to the serial port
		serialPort = SerialPort.getCommPort("COM3");
		serialPort.setComPortTimeouts(SerialPort.TIMEOUT_SCANNER, 0, 0);
		if (serialPort.openPort()) {

			// create a new thread for sending data to the arduino
			Thread thread = new Thread() {
				@Override
				public void run() {
					// wait after connecting, so the bootloader can finish
					try {
						Thread.sleep(100);
					} catch (Exception e) {
					}

					// enter an infinite loop that sends text to the arduino
					PrintWriter output = new PrintWriter(serialPort.getOutputStream());
					while (true) {
						output.print(result.wasSuccessful());
						output.flush();
						try {
							Thread.sleep(100);
						} catch (Exception e) {
						}
					}
				}
			};
			thread.start();

		}

	}
}
