package test;

import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.Runner;
import org.junit.runner.notification.RunNotifier;
import org.junit.runners.Suite;
import org.junit.runners.model.InitializationError;
import org.junit.runners.model.RunnerBuilder;

public class SuitePlus extends Suite {
	
	public SuitePlus(Class<?> klass, RunnerBuilder builder) throws InitializationError {
		super(klass, builder);
	}

	@Override
    protected void runChild(Runner runner, final RunNotifier notifier) {
        runner.run(notifier);
        ClassLoader cl = ClassLoader.getSystemClassLoader();
        Class<?> cls;
		try {
			cls = cl.loadClass(runner.getDescription().toString());
			Result testResult = JUnitCore.runClasses(cls);
			System.out.println(testResult.getFailureCount());
	        System.out.println(testResult.wasSuccessful());
	        //new TwoWaySerialComm().connect("", testResult);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		
		
    }
	
}

