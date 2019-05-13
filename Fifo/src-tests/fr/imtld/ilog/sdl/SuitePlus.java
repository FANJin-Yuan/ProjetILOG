package fr.imtld.ilog.sdl;

import java.util.List;

import org.junit.runner.Description;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.Runner;
import org.junit.runner.notification.RunNotifier;
import org.junit.runners.Suite;
import org.junit.runners.model.InitializationError;
import org.junit.runners.model.RunnerBuilder;

public class SuitePlus extends Suite {

	Result result;
	
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
	        System.out.println(JUnitCore.runClasses(cls).wasSuccessful());
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		
		
		
    }
	
}
