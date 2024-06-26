import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null,
  userId: null,
  requestCompetitor: false,
  isCompetitor: false,
  setUser: (userData) =>
    set((state) => ({
      user: {
        ...state.user,
        ...userData, // Asume que `userData` contiene `username`, `email`, `isCompetitor`, `requestCompetitor`
      },
      userId: userData.id,
      requestCompetitor: userData.requestCompetitor,
      isCompetitor: userData.isCompetitor,
    })),
  logout: () =>
    set({
      user: null,
      userId: null,
      requestCompetitor: false,
      isCompetitor: false,
    }),
}));

export default useUserStore;
