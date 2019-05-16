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

public class SuitePlus extends Suite {

	static int iTestNb;
	static ArrayList<String> listTests = new ArrayList<String>();
	static ArrayList<Result> listResults = new ArrayList<Result>();
	static String message = "";

	public SuitePlus(Class<?> klass, RunnerBuilder builder) throws InitializationError {
		super(klass, builder);
	}

	@Override
	public void run(final RunNotifier notifier) {
		ClassLoader cl = ClassLoader.getSystemClassLoader();
		Class<?> cls = null;

		try {
			cls = cl.loadClass(this.getDescription().toString());
		} catch (ClassNotFoundException e1) {
			e1.printStackTrace();
		}

		Annotation[] arrAnnotation = AllTests.class.getDeclaredAnnotations();
		for (Annotation annotation : arrAnnotation) {
			System.out.println(annotation.toString());
			System.out.println(annotation.annotationType().toString());
			if (annotation.annotationType().toString().equals("interface org.junit.runners.Suite$SuiteClasses")) {
				SuiteClasses testSuiteAnnotation = (SuiteClasses) annotation;
				iTestNb = testSuiteAnnotation.value().length;
			}

		}

		String testName = this.getDescription().toString();
		System.out.println();

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

	@Override
	protected void runChild(Runner runner, final RunNotifier notifier) {
		runner.run(notifier);
		ClassLoader cl = ClassLoader.getSystemClassLoader();
		Class<?> cls = null;

		System.out.println("nombre de tests à réaliser : " + runner.testCount());

		try {
			cls = cl.loadClass(runner.getDescription().toString());
		} catch (ClassNotFoundException e1) {
			e1.printStackTrace();
		}
		String testName = runner.getDescription().getTestClass().getSimpleName();
		listTests.add(testName);
		System.out.println(testName);

		Result testResult = JUnitCore.runClasses(cls);
		listResults.add(testResult);

		if (listTests.size() == iTestNb)
			try {
				// attempt to connect to the serial port

				SerialPort serialPort = SerialPort.getCommPort("COM3");
				serialPort.setComPortTimeouts(SerialPort.TIMEOUT_SCANNER, 0, 0);
				if (serialPort.openPort()) {
					PrintWriter output = new PrintWriter(serialPort.getOutputStream());
					for (int i = 0; i < listTests.size(); i++) {
						String status;
						if (listResults.get(i).wasSuccessful()) {
							status = "ok";
						} else if (!listResults.get(i).wasSuccessful()) {
							status = "ko";
						} else
							status = "Undefined";
						
						//System.out.print(listTests.get(i) + "|" + status + ";");
						/*if (listTests.indexOf(listTests.get(i)) != listTests.size() - 1) {
							System.out.print(";");
						}*/

						message = message + listTests.get(i) + "|" + status + ";";
						
					}
					String Test3 = "test3|ko;";
					String Test4 = "test4|ok;";
					String Test5 = "test5|ko;";
					String Test6 = "test6|ko;";

					message = message + Test3 + Test4 + Test5 + Test6;
					System.out.println(message);
					
					Thread.sleep(2000);
					output.print(message);
					output.flush();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
	}
}
