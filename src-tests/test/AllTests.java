package test;

import org.junit.runner.RunWith;
import org.junit.runners.Suite.SuiteClasses;

@RunWith(SuitePlus.class)
@SuiteClasses({ FifoTest.class, FifoTest2.class, FifoTestUnPeuPlusLong.class })
public class AllTests {}
