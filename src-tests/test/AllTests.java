package test;

import org.junit.runner.RunWith;
import org.junit.runners.Suite.SuiteClasses;
import test.SerialSuite.SetCommPort;

@SetCommPort("COM3")
@RunWith(SerialSuite.class)
@SuiteClasses({ FifoTest.class, FifoTest2.class, FifoTestUnPeuPlusLong.class })
public class AllTests {}
