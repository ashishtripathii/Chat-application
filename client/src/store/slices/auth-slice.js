import { UserIcon } from "lucide-react"

export const createAuthSlice = (set) => ({

    userInfo: undefined,
    setUserInfo: (userInfo) => set({ userInfo }),
});
