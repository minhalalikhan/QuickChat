export const GroupChats = [
    {
        id: 1,
        GroupName: 'Btech ke londe',
        Admin: 'minhalalikhan110@gmail.com',
        created_at: '',
        password: 'venom',
        description: 'time pass spot',
        members: ['minhalalikhan110@gmail.com']
    },
    {
        id: 2,
        GroupName: 'Avengers',
        Admin: 'minhalalikhan110@gmail.com',
        created_at: '',
        password: 'endgame',
        description: 'for marvel enthusiast',
        members: ['minhalalikhan110@gmail.com', 'minhalalikhan.786@gmail.com']
    },
    {
        id: 3,
        GroupName: 'Food Fest',
        Admin: 'phantomvoid@gmail.com',
        created_at: '',
        password: '$2a$10$B.irZZQGxyf3M3FclDmxi.JUXRZsfW0VrO3R2XYRq396AFxOTIxQy',
        description: 'for food lovers',
        members: ['phantomvoid@gmail.com',]
    }
]

export const Messages = [
    {
        Message: 'Hello there',
        Group: 2,
        Sender: 'minhalalikhan.786@gmail.com',
        TimeStamp: ''
    },

    {
        Message: 'welcome',
        Group: 2,
        Sender: 'minhalalikhan.786@gmail.com',
        TimeStamp: ''
    },
    {
        Message: 'Hola',
        Group: 2,
        Sender: 'minhalalikhan110@gmail.com',
        TimeStamp: ''
    },
]


export const LastMessage: {
    id: number,
    LatestMessage: string,
    User: string,
    GroupID: number,
    UnreadCount: number,
    time: string,
    Sender: string

}[] = [
        {
            GroupID: 2,
            LatestMessage: "1234",
            Sender: "minhalalikhan.786@gmail.com",
            UnreadCount: 0,
            User: "minhalalikhan.786@gmail.com",
            id: 2,
            time: "1732878401243",
        },
        {
            GroupID: 2,
            LatestMessage: "1234",
            Sender: "minhalalikhan.786@gmail.com",
            UnreadCount: 0,
            User: "minhalalikhan110@gmail.com",
            id: 2,
            time: "1732878401243",
        }
    ]