package fr.imtld.ilog.sdl;

import java.util.ArrayList;

public class Fifo implements FifoHead, FifoQueue {

	ArrayList<Object> list = new ArrayList<Object>();
	ArrayList<Object> saved = new ArrayList<Object>();

	@Override
	public void add(Object oSig) {
		if (oSig != null)
			list.add(0, oSig);
	}

	@Override
	public void add(int iKind) {
		list.add(0, iKind);
	}

	@Override
	public int getSize() {
		return list.size();
	}

	@Override
	public void remove() {
		if (list.size() != 0)
			list.remove(list.size() - 1);
	}

	@Override
	public Object getHead() {
		if (list.size() != 0)
			return list.get(list.size() - 1);
		else
			return null;
	}

	@Override
	public void save(Class clsSig) {
		if (list.size() != 0) {
			for (int i = 0; i < list.size(); i++) {
				if (list.get(i).getClass() == clsSig) {
					saved.add(list.get(i));
					list.remove(i);
					i--;
				}
			}
		}
		if (clsSig == null) {
			while(saved.size() != 0) {
				list.add(saved.get(saved.size()-1));
				saved.remove(saved.size()-1);
			}
		}
	}

	@Override
	public void save(int iSig) {
		if (list.size() != 0) {
			for (int i = 0; i < list.size(); i++) {
				if ((Integer) list.get(i) == iSig) {
					saved.add(list.get(i));
					list.remove(i);
					i--;
				}
			}

		}
	}
}
