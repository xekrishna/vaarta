import { create } from 'zustand'
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useUserStore } from './userStore';

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isRecieverBlocked: false,

  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser

    //Check if current user is blocked
    if(user.blocked.includes(currentUser.id)){
      set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isRecieverBlocked: false,
      })
    }
    //Check if receiver is blocked
    else if(currentUser.blocked.includes(user.id)){
      set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isRecieverBlocked: true,
      })
    } else {
        return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isRecieverBlocked: false,
      })
    }
  },
  changeBlock : () => {
      set(state=>({...state, isReceiverBlocked: !state.isRecieverBlocked}))
    },
}))