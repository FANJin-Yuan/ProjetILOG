package test;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

import junit.framework.Test;


@RunWith(SuitePlus.class)
@SuiteClasses({ FifoTest.class, FifoTest2.class })
public class AllTests {
	

}
