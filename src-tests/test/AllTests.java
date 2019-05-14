package test;

import java.io.InputStream;
import java.io.OutputStream;

import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

import gnu.io.CommPort;
import gnu.io.CommPortIdentifier;
import gnu.io.NoSuchPortException;
import gnu.io.PortInUseException;
import gnu.io.SerialPort;
import gnu.io.UnsupportedCommOperationException;
import junit.framework.Test;


@RunWith(SuitePlus.class)
@SuiteClasses({ FifoTest.class, FifoTest2.class })
public class AllTests {
	
	static SerialPort serialPort;
	
	public static void main(String[] args) throws Exception {

		Result result = JUnitCore.runClasses(AllTests.class);
		
		CommPortIdentifier portIdentifier = CommPortIdentifier.getPortIdentifier("COM4");
        if ( portIdentifier.isCurrentlyOwned() )
        {
            System.out.println("Error: Port is currently in use");
        }
        else
        {
            CommPort commPort = portIdentifier.open("Appli",2000);
            
            if ( commPort instanceof SerialPort )
            {
                SerialPort serialPort = (SerialPort) commPort;
                serialPort.setSerialPortParams(9600,SerialPort.DATABITS_8,SerialPort.STOPBITS_1,SerialPort.PARITY_NONE);
                
                serialPort.setDTR(false);
                AllTests.serialPort = serialPort;           
                OutputStream out = serialPort.getOutputStream();
            }
            else
            {
                System.out.println("Error: Only serial ports are handled.");
            }
        }

		
		
	}

}
