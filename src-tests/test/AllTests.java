package test;

import org.junit.runner.RunWith;
import org.junit.runners.Suite.SuiteClasses;

@RunWith(SerialSuite.class)
@SuiteClasses({ FifoTest.class, FifoTest2.class, FifoTestUnPeuPlusLong.class })
public class AllTests {}
