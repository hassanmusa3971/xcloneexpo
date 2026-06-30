import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  joinedDate: string;
  followers: number;
  following: number;
  banner: string;
}

export interface Tweet {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  reposts: number;
  views: string;
  likedByUser: boolean;
  repostedByUser: boolean;
  replies?: Comment[];
}

export interface Comment {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'repost' | 'follow' | 'mention';
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  tweetContent?: string;
  timestamp: string;
  unread: boolean;
}

interface AppContextType {
  currentUser: User;
  isAuthenticated: boolean;
  tweets: Tweet[];
  notifications: NotificationItem[];
  login: (username: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, username: string, email: string) => Promise<boolean>;
  addTweet: (content: string, image?: string) => void;
  likeTweet: (tweetId: string) => void;
  repostTweet: (tweetId: string) => void;
  addComment: (tweetId: string, content: string) => void;
  markNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialUser: User = {
  id: '1',
  name: 'Hassan Musa',
  username: 'hassanmusa',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  bio: 'Building the future of mobile applications with React Native & Expo 🚀 | Tech Explorer & Open Source Lover.',
  location: 'Lagos, Nigeria',
  website: 'hassanmusa.dev',
  joinedDate: 'June 2021',
  followers: 1245,
  following: 582,
  banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
};

const initialTweets: Tweet[] = [
  {
    id: 't1',
    user: {
      id: '2',
      name: 'Sarah Connor',
      username: 'sconnor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    content: 'Just finished setting up the new Expo SDK! The performance gains in the new router are absolutely insane. React Native is getting better and better every day. 💻⚡',
    timestamp: '2h',
    likes: 42,
    commentsCount: 1,
    reposts: 12,
    views: '1.2K',
    likedByUser: false,
    repostedByUser: false,
    replies: [
      {
        id: 'c1_1',
        user: {
          name: 'Alex Rivera',
          username: 'arivera',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        },
        content: 'Totally agree! The bundle sizes are also noticeably smaller.',
        timestamp: '1h',
      },
    ],
  },
  {
    id: 't2',
    user: {
      id: '3',
      name: 'Tech Insider',
      username: 'techinsider',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    },
    content: 'Check out the design concept for our upcoming project. Clean, minimal, and fully interactive dark mode. Feedback welcome!',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800',
    timestamp: '4h',
    likes: 128,
    commentsCount: 0,
    reposts: 34,
    views: '5.8K',
    likedByUser: true,
    repostedByUser: false,
    replies: [],
  },
  {
    id: 't3',
    user: {
      id: '4',
      name: 'Emily Davis',
      username: 'emily_d',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
    content: 'Coffee + Coding = The perfect Saturday morning. What are you guys working on today? ☕️💻',
    timestamp: '6h',
    likes: 15,
    commentsCount: 0,
    reposts: 1,
    views: '320',
    likedByUser: false,
    repostedByUser: false,
    replies: [],
  },
];

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'like',
    user: {
      name: 'Sarah Connor',
      username: 'sconnor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    tweetContent: 'Check out the design concept for our upcoming project. Clean, minimal, and fully interactive dark mode.',
    timestamp: '30m',
    unread: true,
  },
  {
    id: 'n2',
    type: 'repost',
    user: {
      name: 'Alex Rivera',
      username: 'arivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    tweetContent: 'Check out the design concept for our upcoming project. Clean, minimal, and fully interactive dark mode.',
    timestamp: '1h',
    unread: true,
  },
  {
    id: 'n3',
    type: 'follow',
    user: {
      name: 'David Beckham',
      username: 'dbeckham',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    timestamp: '5h',
    unread: false,
  },
  {
    id: 'n4',
    type: 'mention',
    user: {
      name: 'Sarah Connor',
      username: 'sconnor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    tweetContent: '@hassanmusa Let me know if you can join the team sync next Monday!',
    timestamp: '1d',
    unread: false,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [tweets, setTweets] = useState<Tweet[]>(initialTweets);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const login = async (username: string) => {
    // Mock login delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    const normalizedUsername = username.trim().toLowerCase();
    setCurrentUser({
      ...initialUser,
      username: normalizedUsername || 'hassanmusa',
      name: username || 'Hassan Musa',
    });
    setIsAuthenticated(true);
    return true;
  };

  const register = async (name: string, username: string, email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCurrentUser({
      ...initialUser,
      name: name || 'New User',
      username: username.trim().toLowerCase() || 'newuser',
    });
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const addTweet = (content: string, image?: string) => {
    const newTweet: Tweet = {
      id: `t_${Date.now()}`,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
      },
      content,
      image,
      timestamp: 'Just now',
      likes: 0,
      commentsCount: 0,
      reposts: 0,
      views: '1',
      likedByUser: false,
      repostedByUser: false,
      replies: [],
    };
    setTweets([newTweet, ...tweets]);
  };

  const likeTweet = (tweetId: string) => {
    setTweets(
      tweets.map((tweet) => {
        if (tweet.id === tweetId) {
          const likedByUser = !tweet.likedByUser;
          return {
            ...tweet,
            likedByUser,
            likes: likedByUser ? tweet.likes + 1 : tweet.likes - 1,
          };
        }
        return tweet;
      })
    );
  };

  const repostTweet = (tweetId: string) => {
    setTweets(
      tweets.map((tweet) => {
        if (tweet.id === tweetId) {
          const repostedByUser = !tweet.repostedByUser;
          return {
            ...tweet,
            repostedByUser,
            reposts: repostedByUser ? tweet.reposts + 1 : tweet.reposts - 1,
          };
        }
        return tweet;
      })
    );
  };

  const addComment = (tweetId: string, content: string) => {
    setTweets(
      tweets.map((tweet) => {
        if (tweet.id === tweetId) {
          const newComment: Comment = {
            id: `c_${Date.now()}`,
            user: {
              name: currentUser.name,
              username: currentUser.username,
              avatar: currentUser.avatar,
            },
            content,
            timestamp: 'Just now',
          };
          return {
            ...tweet,
            commentsCount: tweet.commentsCount + 1,
            replies: [...(tweet.replies || []), newComment],
          };
        }
        return tweet;
      })
    );
  };

  const markNotificationsAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, unread: false }))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        tweets,
        notifications,
        login,
        logout,
        register,
        addTweet,
        likeTweet,
        repostTweet,
        addComment,
        markNotificationsAsRead,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
