package test;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.RunWith;
import org.junit.runner.notification.Failure;
import org.junit.runners.JUnit4;

import test.Fifo;
import test.FifoHead;
import test.FifoQueue;

import static org.junit.Assert.*;

/**
 * JUnit test for fr.imtld.ilog.sdl.Fifo
 * 
 * @version for JUnit4
 * @author Christophe TOMBELLE
 */

@RunWith (JUnit4.class)
public class FifoTest {
	/** Objects used by the test */
	private Object o3, o4, o5;
	/** Objects used by the test */
	private Object i4, i5;

	/**
	 * Builds objects needed for testing purpose.
	 */
	@Before
	public void setUp() {
		o3 = 3.0; // new Double(3);
		o4 = 4.0; // new Double(4);
		o5 = 5.0; // new Double(5);
		i4 = 4; // new Integer(4);
		i5 = 5; //new Integer(5);
	}

	/**
	 * Deletes objects needed for testing purpose.
	 */
	@After
	public void tearDown() {
		o3 = null;
		o4 = null;
		o5 = null;
		i4 = null;
		i5 = null;
	}

	/**
	 * Test Fifo constructor.
	 */
	@Test
	public void testFifo() {
		try {
			Fifo fifo = new test.Fifo();
			FifoHead fifoHead = fifo;
			FifoQueue fifoQueue = fifo;
			assertEquals(0, fifoHead.getSize());
			assertNull(fifoHead.getHead());
			fifoHead.remove(); // should cause no exception
			fifoHead.save(Double.class); // idem
			fifoHead.save(4); // idem
			fifoQueue.add(null); // shouldn't modify fifo state
			assertEquals(0, fifoHead.getSize());
		} catch (Exception e) {
			fail("testFifo : " + e);
		}
	}

	/**
	 * Test basic behaviour for Object signals
	 */
	@Test
	public void testSignals() {
		try {
			Fifo fifo = new test.Fifo();
			FifoHead fifoHead = fifo;
			FifoQueue fifoQueue = fifo;
			fifoQueue.add(o5);
			assertEquals(1, fifoHead.getSize());
			assertSame(o5, fifoHead.getHead());
			fifoQueue.add(o4);
			assertEquals(2, fifoHead.getSize());
			assertSame(o5, fifoHead.getHead());
			fifoQueue.add(o3);
			assertEquals(3, fifoHead.getSize());
			assertSame(o5, fifoHead.getHead());
			// remove 5
			fifoHead.remove();
			assertEquals(2, fifoHead.getSize());
			assertSame(o4, fifoHead.getHead());
			// remove 4
			fifoHead.remove();
			assertEquals(1, fifoHead.getSize());
			assertSame(o3, fifoHead.getHead());
			// remove 3
			fifoHead.remove();
			assertEquals(0, fifoHead.getSize());
			assertNull(fifoHead.getHead());
			fifoHead.remove();
		} catch (Exception e) {
			fail(e.toString());
		}
	}

	/**
	 * Test basic behaviour for int signals.
	 */
	@Test
	public void testInt() {
		try {
			Fifo fifo = new test.Fifo();
			FifoHead fifoHead = fifo;
			FifoQueue fifoQueue = fifo;
			fifoQueue.add(5);
			assertEquals(1, fifoHead.getSize());
			assertEquals(i5, fifoHead.getHead());
			fifoHead.remove();
			fifoHead.remove();
		} catch (Exception e) {
			fail(e.toString());
		}
	}

	/**
	 * Test save feature.
	 */
	@Test
	public void testSave() {
		try {
			// initialize the fifo
			Fifo fifo = new test.Fifo();
			FifoHead fifoHead = fifo;
			FifoQueue fifoQueue = fifo;
			fifoHead.save(Double.class);
			fifoQueue.add(o3);
			fifoQueue.add(o3);
			fifoQueue.add(o3);
			fifoQueue.add(4);
			fifoQueue.add(5);
			fifoQueue.add(5);
			// save( Class )
			fifoHead.save(Double.class);
			assertEquals(3, fifoHead.getSize());
			assertEquals(i4, fifoHead.getHead());
			// remove 4
			fifoHead.remove();
			assertEquals(i5, fifoHead.getHead());
			// save( int )
			fifoHead.save(5);
			assertEquals(0, fifoHead.getSize());
			// reset savings
			fifoHead.save(null);
			assertEquals(5, fifoHead.getSize());
			// remove and check remaining signals
			fifoHead.remove();
			assertEquals(4, fifoHead.getSize());
			fifoHead.remove();
			assertEquals(3, fifoHead.getSize());
			fifoHead.remove();
			assertEquals(2, fifoHead.getSize());
			fifoHead.remove();
			assertEquals(1, fifoHead.getSize());
			fifoHead.remove();
			assertEquals(0, fifoHead.getSize());
			fifoHead.remove();
			assertEquals(0, fifoHead.getSize());
			assertNull(null, fifoHead.getHead());
		} catch (Exception e) {
			fail(e.toString());
		}
	}

	/**
	 * This test case has a main so that it can be launched as a standalone
	 * application.
	 * 
	 * @param straArgs
	 *            The command line arguments (unused).
	 */
	public static void main(String[] straArgs) {
		Result result = JUnitCore.runClasses(FifoTest.class);
		System.out.printf("%d tests run\n", result.getRunCount());
		System.out.printf("%d failures\n", result.getFailureCount());
		System.out.printf("%d ignored\n", result.getIgnoreCount());
		for (Failure failure : result.getFailures()) {
			System.out.println(failure.toString());
		}
		long duration = result.getRunTime();
		Object status = result.wasSuccessful() ? "success." : "failure.";
		System.out.printf("Test run in %d ms : %s\n", duration, status);
	}
}
