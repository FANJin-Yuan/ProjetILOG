package test;

/**
 * The queue end of a fifo.
 * @version $Id: FifoQueue.java,v 1.1 2005/02/17 09:31:34 tombelle Exp $
 * @author Christophe TOMBELLE
 */
public interface FifoQueue {
    /**
     * Append the specified signal instance to this Fifo.
     * @param oSig The signal instance to append, null shouldn't modify fifo
     * state.
     */
    void add( Object oSig );
    /**
     * Append the specified signal instance to this Fifo.
     * @param iKind The signal do add.
     */
    void add( int iKind );
}
