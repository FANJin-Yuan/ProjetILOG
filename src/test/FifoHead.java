package test;
/**
 * The head end of an SDL fifo. Compared with a regular Fifo, head signals of a
 * specified kind may be saved -for a future use- so that following signals are
 * accessible instead. Savings remain until they are reset.
 * @version $Id: FifoHead.java,v 1.1 2005/02/17 09:31:34 tombelle Exp $
 * @author Christophe TOMBELLE
 */
public interface FifoHead {
    /**
     * Get the number of accessible (not saved) signals.
     * @return The number of accessible signals.
     */
    int getSize();
    /**
     * Remove the signal from the fifo head.
     */    
    void remove();
    /**
     * Get the signal at the fifo head. Doesn't remove the signal from the fifo.
     * @return The signal at the fifo head.
     */    
    Object getHead();
    /**
     * Save head signals of the specified class. Modifies the position
     * of the fifo head.
     * @param clsSig Class of the signals to save, null to reset previous savings.
     */
    void save( Class clsSig );
    /**
     * Save head Integer signals of the specified value. Modifies the position
     * of the fifo head.
     * @param iSig The value for Integer signals to save.
     */
    void save( int iSig );
}
