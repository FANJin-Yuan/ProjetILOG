package test;

import java.io.PrintWriter;
import java.lang.annotation.Annotation;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
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
 * {@literal @}SuiteClasses(TestClass1.class, ...). When you run this class, it will run all the tests in all the suite classes
 * and send the results to the serial port.
 *
 */
public class SerialSuite extends Suite {

	/**
	 * Annotation used to define serial port to be used
	 */
	@Retention(RetentionPolicy.RUNTIME)  
	@Target(ElementType.TYPE)  
	@interface SetCommPort{  
		String value();  
		}
	/**
	 * Number of test classes within global test
	 */
	static int iTestNb;
	
	/**
	 * String containing the serial port
	 */
	static String commPort;
	
	/**
	 * Array used to store test names
	 */
	static ArrayList<String> listTests = new ArrayList<String>();
	
	/**
	 * Array used to store test results
	 */
	static ArrayList<Result> listResults = new ArrayList<Result>();
	
	/**
	 * Message to be sent to the serial port
	 */
	static String message = "";

	public SerialSuite(Class<?> klass, RunnerBuilder builder) throws InitializationError {
		super(klass, builder);
	}

	/**
	 * Runs the test for this runner and sets the number of tests classes in the suite.
	 */
	@Override
	public void run(final RunNotifier notifier) {
		Annotation[] arrAnnotation = AllTests.class.getDeclaredAnnotations();
		for (Annotation annotation : arrAnnotation) {
			if (annotation.annotationType().toString().equals("interface org.junit.runners.Suite$SuiteClasses")) {
				SuiteClasses testSuiteAnnotation = (SuiteClasses) annotation;
				iTestNb = testSuiteAnnotation.value().length;
			}
			else if (annotation.annotationType().toString().equals("interface test.SerialSuite$SetCommPort")) {
				
				SetCommPort commPortAnnotation = (SetCommPort) annotation;
				commPort = commPortAnnotation.value();
				System.out.println(commPort);
			}
		}

		//Default run implementation of class ParentRunner<Runner> which Suite extends.
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
	 * Runs the test corresponding to child runner.
	 * Performs connection to serial port and sends defined message.
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
					messageSet();
					Thread.sleep(2000);
					output.print(message);
					output.flush();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
	}


	/**
	 * Gives serial port corresponding to input value.
	 * @return Said serial port
	 */
	private SerialPort setSerialPort() {
		SerialPort serialPort = SerialPort.getCommPort(commPort);
		serialPort.setComPortTimeouts(SerialPort.TIMEOUT_SCANNER, 0, 0);
		return serialPort;
	}
	
	/**
	 * Sets the message to send based on preset format.
	 * Example for testName1 that was a success and testName2 that failed 2 tests out of 7 :
	 * testName1|ok;nomTest2|5/7|ko
	 */
	private void messageSet() {
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

	/**
	 * Concatenates each test name and result to message according to preset format.
	 * @param i index of results and test names lists
	 * @param status string corresponding to the test result
	 */
	private void messageCat(int i, String status) {
		message = message + listTests.get(i) + "|" + status + ";";
	}

	/**
	 * Defines string to be sent to serial port when a test is successful.
	 * @return String to be sent to serial port when a test is successful.
	 */
	private String successStatus() {
		String status;
		status = "ok";
		return status;
	}

	/**
	 * Defines string to be sent to serial port when a test failed.
	 * @param i index of test result being checked
	 * @return String to be sent to serial port when a test failed.
	 */
	private String failureStatus(int i) {
		String status;
		int successfulSubTestsWithinTest = listResults.get(i).getRunCount()-listResults.get(i).getFailureCount();
		status = successfulSubTestsWithinTest + "/" + listResults.get(i).getRunCount() + "|" + "ko";
		return status;
	}

	/**
	 * Gets the test class for runner passed in parameters
	 * @param runner handling the test class
	 * @return Said test class
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
