package test;

import java.io.PrintWriter;
import java.lang.annotation.Annotation;
import java.util.ArrayList;

import org.junit.AssumptionViolatedException;
import org.junit.internal.runners.model.EachTestNotifier;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.Runner;
import org.junit.runner.notification.RunNotifier;
import org.junit.runner.notification.StoppedByUserException;
import org.junit.runners.Suite;
import org.junit.runners.model.InitializationError;
import org.junit.runners.model.RunnerBuilder;
import org.junit.runners.model.Statement;

import com.fazecast.jSerialComm.SerialPort;
/**
 * Using SerialSuite as a runner allows you to manually build a suite containing tests from many classes and send
 * the results to a serial port. To use it, annotate a class with @RunWith(SerialSuite.class) and 
 * @SuiteClasses(TestClass1.class, ...). When you run this class, it will run all the tests in all the suite classes
 * and send the results to the serial port.
 *
 */
public class SuitePlus extends Suite {

	static int iTestNb;
	static ArrayList<String> listTests = new ArrayList<String>();
	static ArrayList<Result> listResults = new ArrayList<Result>();
	static String message = "";

	public SuitePlus(Class<?> klass, RunnerBuilder builder) throws InitializationError {
		super(klass, builder);
	}

	/**
	 * Runs the test for this runner and finds the number of tests classes in the suite.
	 */
	@Override
	public void run(final RunNotifier notifier) {
		Annotation[] arrAnnotation = AllTests.class.getDeclaredAnnotations();
		for (Annotation annotation : arrAnnotation) {
			System.out.println(annotation.toString());
			System.out.println(annotation.annotationType().toString());
			if (annotation.annotationType().toString().equals("interface org.junit.runners.Suite$SuiteClasses")) {
				SuiteClasses testSuiteAnnotation = (SuiteClasses) annotation;
				iTestNb = testSuiteAnnotation.value().length;
			}

		}

		EachTestNotifier testNotifier = new EachTestNotifier(notifier, getDescription());
		testNotifier.fireTestStarted();
		try {
			Statement statement = classBlock(notifier);
			statement.evaluate();
		} catch (AssumptionViolatedException e) {
			testNotifier.addFailedAssumption(e);
		} catch (StoppedByUserException e) {
			throw e;
		} catch (Throwable e) {
			testNotifier.addFailure(e);
		} finally {
			testNotifier.fireTestFinished();
		}
	}

	/**
	 * Runs the test corresponding to child
	 */
	@Override
	protected void runChild(Runner runner, final RunNotifier notifier) {
		runner.run(notifier);
		Class<?> cls = getTestClass(runner);
		
		String testName = runner.getDescription().getTestClass().getSimpleName();
		listTests.add(testName);

		Result testResult = JUnitCore.runClasses(cls);
		listResults.add(testResult);

		if (listTests.size() == iTestNb)
			try {
				
				SerialPort serialPort = setSerialPort();
				if (serialPort.openPort()) {
					PrintWriter output = new PrintWriter(serialPort.getOutputStream());
					messageFormat();
					Thread.sleep(2000);
					output.print(message);
					output.flush();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
	}


	/**
	 * 
	 * @return
	 */
	private SerialPort setSerialPort() {
		// attempt to connect to the serial port
		SerialPort serialPort = SerialPort.getCommPort("COM3");
		serialPort.setComPortTimeouts(SerialPort.TIMEOUT_SCANNER, 0, 0);
		return serialPort;
	}
	
	/**
	 * 
	 */
	private void messageFormat() {
		for (int i = 0; i < listTests.size(); i++) {
			String status;
			if (listResults.get(i).wasSuccessful()) {
				status = successStatus();
			} else if (!listResults.get(i).wasSuccessful()) {
				status = failureStatus(i);
			} else
				status = "Undefined";
			messageCat(i, status);
		}
	}

	private void messageCat(int i, String status) {
		message = message + listTests.get(i) + "|" + status + ";";
	}

	/**
	 * 
	 */
	private String successStatus() {
		String status;
		status = "ok";
		return status;
	}

	/**
	 * 
	 * @param i
	 * @return
	 */
	private String failureStatus(int i) {
		String status;
		int successfulSubTestsWithinTest = listResults.get(i).getRunCount()-listResults.get(i).getFailureCount();
		status = successfulSubTestsWithinTest + "/" + listResults.get(i).getRunCount() + "|" + "ko";
		return status;
	}

	/**
	 * 
	 * @param runner
	 * @return
	 */
	private Class<?> getTestClass(Runner runner) {
		ClassLoader cl = ClassLoader.getSystemClassLoader();
		Class<?> cls = null;

		try {
			cls = cl.loadClass(runner.getDescription().toString());
		} catch (ClassNotFoundException e1) {
			e1.printStackTrace();
		}
		return cls;
	}
}
